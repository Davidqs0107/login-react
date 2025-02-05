import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
export const MapLeaflet = ({ onPosition, client }) => {
    const [position, setPosition] = useState([-17.78416063196657, -63.18134307861329]); // Coordenadas por defecto
    const [userPosition, setUserPosition] = useState(null); // Para la posición del usuario

    useEffect(() => {
        if (client?.latitud && client?.longitud) {
            // Si el cliente tiene coordenadas, usa esas
            const clientCoords = [client.latitud, client.longitud];
            setPosition(clientCoords);
            setUserPosition(clientCoords);
        } else if (navigator.geolocation) {
            // Si no, usa la geolocalización del navegador
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userCoords = [latitude, longitude];
                    setPosition(userCoords);
                    setUserPosition(userCoords);
                },
                (error) => {
                    console.error('Error obteniendo la geolocalización:', error);
                }
            );
        } else {
            console.error('Geolocalización no soportada por este navegador.');
        }
    }, [client]); // Dependencia al cliente para actualizar si cambia

    const eventHandlers = {
        dragend: (e) => {
            const newCoords = e.target.getLatLng();
            setPosition([newCoords.lat, newCoords.lng]);
            onPosition(newCoords);
        },
    };
    const markerIcon = new L.icon({
        iconUrl: './listado/marker-icon.png',
        iconSize: [25, 35]
    })
    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} className='z-0'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
                icon={markerIcon}
                position={position}
                draggable
                eventHandlers={eventHandlers}
            >
                <Popup>
                    {userPosition
                        ? `Tu ubicación aproximada: ${userPosition[0]}, ${userPosition[1]}`
                        : 'Mueve el marcador para seleccionar una posición.'}
                </Popup>
            </Marker>
        </MapContainer>
    );
};
