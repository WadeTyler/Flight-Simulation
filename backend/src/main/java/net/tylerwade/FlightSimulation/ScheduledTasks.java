package net.tylerwade.FlightSimulation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.task.TaskExecutionProperties;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;

@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    private boolean sentEmptyList = false;

    @Scheduled(fixedRate = 100)
    public void reportCurrentAirplanes() {
        // Outputs current airplanes to the websockets
        if (!FlightSimulationApplication.airplanes.isEmpty()) {
            WebSocketController.outputAirplanes();

            sentEmptyList = false;
        }

        // Output empty list if empty one time
        if (FlightSimulationApplication.airplanes.isEmpty() && !sentEmptyList) {
            WebSocketController.outputAirplanes();

            sentEmptyList = true;
        }
    }

}
