// FlightController.java
// Used to control the flight of an airplane.

package net.tylerwade.FlightSimulation;

import ch.qos.logback.classic.pattern.ClassOfCallerConverter;
import net.tylerwade.FlightSimulation.models.Airplane;
import net.tylerwade.FlightSimulation.models.RouteVertex;
import net.tylerwade.FlightSimulation.models.Station;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;


public class FlightController {

    // Array of stations in traversal order. The first station is always the starting station
    private RouteVertex startingPoint;

    // Airplane that the controller controls
    private final Airplane airplane;

    private boolean landed = false;
    private LocalDateTime startTime;
    private LocalDateTime landedTime;
    private LocalDateTime lastTimestamp;
    private double totalFlightDuration = 0;
    private ArrayList<Station> route;
    private ArrayList<LocationStamp> locationStamps = new ArrayList<>();

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // Constructor
    public FlightController(RouteVertex startingPoint, Airplane airplane, ArrayList<Station> route) {
        this.startingPoint = startingPoint;
        this.airplane = airplane;
        this.route = route;

        startFlight();
    }

    // Traverse the route.
    public void startFlight() {

        startTime = LocalDateTime.now();
        lastTimestamp = LocalDateTime.now();

        // Announce starting route
        System.out.println("Starting Route:");
        System.out.println("---------------");
        RouteVertex temp = startingPoint;
        System.out.println("Starting Point: " + temp.station.getName());
        temp = temp.next;
        int index = 1;
        while (temp != null) {
            System.out.println("Destination " + index + ": " + temp.station.getName());
            temp = temp.next;
            index++;
        }
        System.out.println("---------------");

        // Set planes starting location
        airplane.setLongitude(startingPoint.station.getLongitude());
        airplane.setLatitude(startingPoint.station.getLatitude());

        double flightDuration[] = { calculateFlightDuration(startingPoint.station, startingPoint.next.station, airplane.getSpeed()) };
        double timeRemaining[] = { flightDuration[0] };
        double totalFlightTime[] = { flightDuration[0] };

        Timer timer = new Timer();
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                String now = LocalDateTime.now().format(formatter);

                // Landed at a station
                if (timeRemaining[0] <= 0) {
                    System.out.println(now + " - Landed at " + startingPoint.next.station.getName());

                    startingPoint = startingPoint.next;

                    // Landed at final Destination
                    if (startingPoint.next == null) {
                        System.out.println(now + " - Destination Reached. Total Flight Time: " + String.format("%.2f", totalFlightTime[0]) + " hours at " + airplane.getSpeed() + "/mph");

                        totalFlightDuration = totalFlightTime[0];
                        landed = true;
                        landedTime = LocalDateTime.now();
                        lastTimestamp = LocalDateTime.now();

                        this.cancel();
                        timer.cancel();
                        return;
                    }

                    // Not final destination
                    flightDuration[0] = calculateFlightDuration(startingPoint.station, startingPoint.next.station, airplane.getSpeed());
                    timeRemaining[0] = flightDuration[0];
                    totalFlightTime[0] = flightDuration[0];
                }

                // Output current location
//                System.out.println(now + " - " + airplane.getLongitude() + ", " + airplane.getLatitude());

                // Update Location and update the time remaining
                updateLocation(startingPoint.station, startingPoint.next.station, timeRemaining[0], flightDuration[0]);
                timeRemaining[0] -= .1;
            }
        };
        timer.scheduleAtFixedRate(task, 0, 100);
    }

    // Update airplane location
    private void updateLocation(Station startingStation, Station endStation, double timeRemaining, double flightDuration) {
        double elapsedTime = flightDuration - timeRemaining;

        // Will be between 0 and 1. (1 meaning arrived at station)
        double progress = elapsedTime / flightDuration;

        double currentLatitude = startingStation.getLatitude() + (endStation.getLatitude() - startingStation.getLatitude()) * progress;
        double currentLongitude = startingStation.getLongitude() + (endStation.getLongitude() - startingStation.getLongitude()) * progress;

        double deltaX = endStation.getLongitude() - startingStation.getLongitude();
        double deltaY = endStation.getLatitude() - startingStation.getLatitude();
        double angle = Math.toDegrees(Math.atan2(deltaY, deltaX));
        if (angle < 0) {
            angle += 360;
        }

        airplane.setLatitude(currentLatitude);
        airplane.setLongitude(currentLongitude);
        airplane.setRotation(angle);
        System.out.println(angle);

        if (locationStamps.size() >= 30) {
            locationStamps.remove(0);
        }
        locationStamps.add(new LocationStamp(currentLongitude, currentLatitude));
    }


    /* Calculates the flight duration between 2 stations by using the haversine formula  */
    public static double calculateFlightDuration(Station startStation, Station endStation, int speed) {
        final int EARTH_RADIUS_MILES = 3959;

        // Convert longitude and latitude from degrees to radians
        double lon1 = Math.toRadians(startStation.getLongitude());
        double lon2 = Math.toRadians(endStation.getLongitude());
        double lat1 = Math.toRadians(startStation.getLatitude());
        double lat2 = Math.toRadians(endStation.getLatitude());

        // Haversine formula
        double deltaLat = lat2 - lat1;
        double deltaLon = lon2 - lon1;

        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Distance in miles
        double distance = EARTH_RADIUS_MILES * c;

        // Calculate the flight duration in hours
        return distance / speed;
    }

    public Airplane getAirplane() {
        return airplane;
    }

    public boolean isLanded() {
        return landed;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getLandedTime() {
        return landedTime;
    }

    public double getTotalFlightDuration() {
        return totalFlightDuration;
    }

    public LocalDateTime getLastTimestamp() {
        return lastTimestamp;
    }

    public ArrayList<Station> getRoute() {
        return route;
    }

    public ArrayList<LocationStamp> getLocationStamps() {
        return locationStamps;
    }
}

class LocationStamp {
    private LocalDateTime timestamp;
    private double longitude;
    private double latitude;

    public LocationStamp(double longitude, double latitude) {
        this.timestamp = LocalDateTime.now();
        this.longitude = longitude;
        this.latitude = latitude;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public double getLongitude() {
        return longitude;
    }

    public double getLatitude() {
        return latitude;
    }
}
