package net.tylerwade.FlightSimulation.models;

import net.tylerwade.FlightSimulation.FlightSimulationApplication;
import org.springframework.stereotype.Component;

public class Airplane {

    private int id;
    private String name;
    private int speed;
    private double longitude;
    private double latitude;

    public Airplane (String name, int speed) {
        this.id = FlightSimulationApplication.airplanes.size();
        this.name = name;
        this.speed = speed;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
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

    @Override
    public String toString() {
        return "Airplane " + id + ": " + name + " - Speed: " + speed;
    }
}
