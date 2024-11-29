package net.tylerwade.FlightSimulation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.task.TaskExecutionProperties;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    private boolean sentEmptyAirplanes = false;

    @Scheduled(fixedRate = 100)
    public void reportCurrentAirplanes() {
        // Outputs current airplanes to the websockets
        if (!FlightSimulationApplication.airplanes.isEmpty()) {
            WebSocketController.outputAirplanes();

            sentEmptyAirplanes = false;
        }

        // Output empty list if empty one time
        if (FlightSimulationApplication.airplanes.isEmpty() && !sentEmptyAirplanes) {
            WebSocketController.outputAirplanes();

            sentEmptyAirplanes = true;
        }
    }

    @Scheduled(fixedRate = 5000)
    public void reportCurrentFlights() {
        // Output current Flights to the websocket
        ArrayList<FlightController> flights = FlightSimulationApplication.getFlights();
        WebSocketController.outputFlights();
    }

    // Every 5 minutes delete flights that landed more than 10 minutes ago
    @Scheduled(fixedRate = 300000)
    public void clearOldFlights() {
        ArrayList<FlightController> flights = FlightSimulationApplication.flights;

        LocalDateTime tenMinutesAgo = LocalDateTime.now().minusMinutes(10);

        flights.removeIf(flight -> flight.isLanded() && flight.getLandedTime().isBefore(tenMinutesAgo));
    }


}
