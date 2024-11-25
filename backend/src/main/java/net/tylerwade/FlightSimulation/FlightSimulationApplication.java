package net.tylerwade.FlightSimulation;

import net.tylerwade.FlightSimulation.models.Airplane;
import net.tylerwade.FlightSimulation.models.RouteVertex;
import net.tylerwade.FlightSimulation.models.Station;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.util.RouteMatcher;

import java.lang.reflect.Array;
import java.util.ArrayList;

@SpringBootApplication
@EnableScheduling
public class FlightSimulationApplication {

	public static void main(String[] args) {
		SpringApplication.run(FlightSimulationApplication.class, args);

		// Create Stations
		Station virginiaStation = new Station("Viriginia Airlines", 37.4316, -78.6569);
		Station californiaStation = new Station("California Airlines", 36.7783, -119.4179);
		Station texasStation = new Station("Texas Airlines" , 31.9686, -99.9018);

		System.out.println(virginiaStation);
		System.out.println(californiaStation);
		System.out.println(texasStation);

		// Example
		// Route goes from virginia -> texas -> california
		RouteVertex startingPoint = new RouteVertex(virginiaStation, new RouteVertex(texasStation, new RouteVertex(californiaStation, null)));

		Airplane plane1 = new Airplane("Plane 1", 150);
		FlightController flight1 = new FlightController(startingPoint, plane1);
		flight1.startFlight();
	}

}
