// RouteVertex.java
// Used as a node in a linkedList

package net.tylerwade.FlightSimulation.models;

public class RouteVertex {

    public Station station;
    public RouteVertex next;

    public RouteVertex(Station station, RouteVertex next) {
        this.station = station;
        this.next = next;
    }
}
