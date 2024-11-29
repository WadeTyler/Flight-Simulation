package net.tylerwade.FlightSimulation;

import net.tylerwade.FlightSimulation.models.Airplane;
import net.tylerwade.FlightSimulation.models.RouteVertex;
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

    // Output Flights
    @MessageMapping("/retrieveflights")
    public static void outputFlights() {
        ArrayList<FlightController> flights = FlightSimulationApplication.getFlights();
        messagingTemplate.convertAndSend("/topic/flights", flights);
    }

    // Create a new flight
    @MessageMapping("/createflight")
    public void createAirplane(CreateFlightRequest flightRequest) {
        System.out.println("Attempting to create an airplane");

        System.out.println(flightRequest);

        // Create linkedlist from array
        RouteVertex head = null;
        RouteVertex current = null;

        for (Station station : flightRequest.getRoute()) {
            RouteVertex newVertex = new RouteVertex();
            newVertex.station = station;
            if (head == null) {
                head = newVertex;
                current = head;
            } else {
                current.next = newVertex;
                current = current.next;
            }
        }

        // Add airplane

        Airplane airplane = flightRequest.getAirplane();
        FlightSimulationApplication.addAirplane(airplane);

        // Create and Start the Flight
        FlightController flight = new FlightController(head, airplane, flightRequest.getRoute());

        FlightSimulationApplication.flights.add(flight);

    }
}

class CreateFlightRequest {
    private Airplane airplane;
    private ArrayList<Station> route;

    public Airplane getAirplane() {
        return airplane;
    }

    public void setAirplane(Airplane airplane) {
        this.airplane = airplane;
    }

    public ArrayList<Station> getRoute() {
        return route;
    }

    public void setRoute(ArrayList<Station> route) {
        this.route = route;
    }

    @Override
    public String toString() {
        return "CreateFlightRequest{" +
                "airplane=" + airplane +
                ", route=" + route +
                '}';
    }
}
