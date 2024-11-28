package net.tylerwade.FlightSimulation;

import net.tylerwade.FlightSimulation.models.Airplane;
import net.tylerwade.FlightSimulation.models.Station;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;

@Controller
public class WebSocketController {

    private static SimpMessagingTemplate messagingTemplate;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        WebSocketController.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/stations")
    @SendTo("/topic/stations")
    public ArrayList<Station> sendStations() {
        return FlightSimulationApplication.getStations();
    }

    // Get all Stations and send them to the user
    @MessageMapping("/retrievestations")
    public void getStations() {
        ArrayList<Station> stations = FlightSimulationApplication.getStations();
        System.out.println("Retrieving Stations");
        messagingTemplate.convertAndSend("/topic/stations", stations);
    }

    // Create a new stations and send it to all users
    @MessageMapping("/createstation")
    public void receiveStation(Station station) {
        // Add station to array
        FlightSimulationApplication.addStation(station);

        System.out.println("New Station Created: " + station);

        // Convert and Send a new station back out
        messagingTemplate.convertAndSend("/topic/newstation", station);
    }

    // Get all airplanes and send back to the user
    @MessageMapping("/retrieveairplanes")
    public static void outputAirplanes() {
        ArrayList<Airplane> airplanes = FlightSimulationApplication.getAirplanes();
        messagingTemplate.convertAndSend("/topic/airplanes", airplanes);
    }


}
