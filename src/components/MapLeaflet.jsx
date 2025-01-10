
import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export const MapLeaflet = ({ onPosition, client }) => {
    const [position, setPosition] = useState([-17.830045, -63.227303]); // Coordenadas por defecto
    const [userPosition, setUserPosition] = useState(null); // Para la posición del usuario

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                    setUserPosition([latitude, longitude]); // Actualiza la posición del usuario
                },
                (error) => {
                    console.error('Error obteniendo la geolocalización:', error);
                }
            );
        } else {
            console.error('Geolocalización no soportada por este navegador.');
        }
        if (client && client.latitud && client.longitud) {
            setPosition([client.latitud, client.longitud]);
            setUserPosition([client.latitud, client.longitud]);
        }
    }, [client]);

    const eventHandlers = {
        dragend: (e) => {
            const newCoords = e.target.getLatLng();
            setPosition([newCoords.lat, newCoords.lng]);
            onPosition(newCoords);
        },
    };

    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
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
