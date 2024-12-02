package net.tylerwade.FlightSimulation;

import net.tylerwade.FlightSimulation.models.Airplane;
import net.tylerwade.FlightSimulation.models.RouteVertex;
import net.tylerwade.FlightSimulation.models.Station;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.ArrayList;

@SpringBootApplication
@EnableScheduling
public class FlightSimulationApplication {

	public static ArrayList<Station> stations = new ArrayList<>();
	public static ArrayList<FlightController> flights = new ArrayList<>();

	public static void main(String[] args) {
		SpringApplication.run(FlightSimulationApplication.class, args);

		// Create Stations
		Station virginiaStation = new Station("Virginia Airlines", 37.4316, -78.6569);
		Station californiaStation = new Station("California Airlines", 36.7783, -119.4179);
		Station texasStation = new Station("Texas Airlines" , 31.9686, -99.9018);

		stations.add(virginiaStation);
		stations.add(californiaStation);
		stations.add(texasStation);

		ArrayList<Station> route = new ArrayList<>();
		route.add(virginiaStation);
		route.add(californiaStation);
		route.add(texasStation);

		// Route goes from virginia -> texas -> california
		RouteVertex startingPoint = new RouteVertex(virginiaStation, new RouteVertex(texasStation, new RouteVertex(californiaStation, null)));

		Airplane plane1 = new Airplane("Plane 1", 150);
		FlightController flight1 = new FlightController(startingPoint, plane1, route);
		addFlight(flight1);
	}

	public static ArrayList<Station> getStations() {
		return stations;
	}

	public static void addStation(Station station) {
		stations.add(station);
	}

	public static ArrayList<FlightController> getFlights() {
		return flights;
	}

	public static void addFlight(FlightController flight) {
		flights.add(flight);
	}
}
