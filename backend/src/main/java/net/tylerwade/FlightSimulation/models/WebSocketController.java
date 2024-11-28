package net.tylerwade.FlightSimulation.models;

import net.tylerwade.FlightSimulation.FlightController;
import net.tylerwade.FlightSimulation.FlightSimulationApplication;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/stations")
    @SendTo("/topic/stations")
    public ArrayList<Station> sendStations() {
        return FlightSimulationApplication.getStations();
    }

    @MessageMapping("/retrievestations")
    public void getStations() {
        ArrayList<Station> stations = FlightSimulationApplication.getStations();
        System.out.println("Retrieving Stations");
        messagingTemplate.convertAndSend("/topic/stations", stations);
    }


    @MessageMapping("/createstation")
    public void receiveStation(Station station) {
        // Add station to array
        FlightSimulationApplication.addStation(station);

        System.out.println("New Station Created: " + station);

        // Convert and Send a new station back out
        messagingTemplate.convertAndSend("/topic/newstation", station);
    }

}
