package net.tylerwade.FlightSimulation.models;

import java.time.LocalDateTime;

public class Station {

    private String name;
    private double longitude;
    private double latitude;
    private LocalDateTime timestamp;

    public Station (String name, double latitude, double longitude) {
        this.name = name;
        this.longitude = longitude;
        this.latitude = latitude;
        this.timestamp = LocalDateTime.now();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String toString() {
        return "Station Name: " + this.name + " | Location: " + latitude + ", " + longitude;
    }
}
