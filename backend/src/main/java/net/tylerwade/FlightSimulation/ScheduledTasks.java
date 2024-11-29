package net.tylerwade.FlightSimulation;

import net.tylerwade.FlightSimulation.models.Station;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    // Output current Flights to the websocket
    @Scheduled(fixedRate = 100)
    public void reportCurrentFlights() {
        ArrayList<FlightController> flights = FlightSimulationApplication.getFlights();

        if (!flights.isEmpty()) WebSocketController.outputFlights();
    }

    // Every 1 minute delete flights that landed more than 5 minutes ago
    @Scheduled(fixedRate = 60000)
    public void clearOldFlights() {
        ArrayList<FlightController> flights = FlightSimulationApplication.flights;

        LocalDateTime limitTime = LocalDateTime.now().minusMinutes(5);

        flights.removeIf(flight -> flight.isLanded() && flight.getLandedTime().isBefore(limitTime));
    }

    // Every 2 minutes delete stations that are older than 5 minutes if there is no current flights
    @Scheduled(fixedRate = 120000)
    public void clearUnusedStations() {
        ArrayList<Station> stations = FlightSimulationApplication.stations;
        ArrayList<FlightController> flights = FlightSimulationApplication.flights;

        LocalDateTime limitTime = LocalDateTime.now().minusMinutes(5);

        // If there is no current flights, delete old stations
        if (flights.isEmpty()) {
            stations.removeIf(station -> station.getTimestamp().isBefore(limitTime));
        }

    }


}
