import { GoogleMap } from '@react-google-maps/api';

import { useRef } from 'react';

import { useGoogleMapsLoader } from 'hooks/useGoogleMapsLoader';

import styles from './Map.module.css';

const options = {
    gestureHandling: 'greedy',
    mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
    fullscreenControl: true
};

interface MapProps {
    geoLocation?: string;
    address?: string;
    styles?: React.CSSProperties;
    getDirectionButton?: boolean;
}

const Map = ({ geoLocation, address, styles: customStyles, getDirectionButton = true }: MapProps) => {
    const { isLoaded } = useGoogleMapsLoader();
    const mapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const directionsControlRef = useRef<HTMLDivElement | null>(null);
    const [lat, lng] = geoLocation?.split(',').map(Number) || [];

    const createDirectionsControl = (map: google.maps.Map) => {
        const controlButton = document.createElement('button');
        controlButton.style.backgroundColor = 'var(--color-white)';
        controlButton.style.border = '0.1rem solid var(--color-grey-200)';
        controlButton.style.borderRadius = '0.6rem';
        controlButton.style.boxShadow = '0 0.2rem 0.6rem rgba(0, 0, 0, 0.3)';
        controlButton.style.color = 'var(--color-grey-800)';
        controlButton.style.cursor = 'pointer';
        controlButton.style.fontFamily = 'inherit';
        controlButton.style.fontSize = '1.2rem';
        controlButton.style.fontWeight = '500';
        controlButton.style.lineHeight = '1.4rem';
        controlButton.style.margin = '0.8rem';
        controlButton.style.padding = '0 1rem';
        controlButton.style.height = '2.8rem';
        controlButton.style.display = 'flex';
        controlButton.style.alignItems = 'center';
        controlButton.style.gap = '0.6rem';
        controlButton.textContent = 'Directions';
        controlButton.title = 'Get Directions';
        controlButton.type = 'button';

        const icon = document.createElement('i');
        icon.className = 'icon-map-pin';
        icon.style.fontSize = '1.4rem';
        icon.style.color = 'var(--color-grey-500)';
        controlButton.insertBefore(icon, controlButton.firstChild);

        controlButton.addEventListener('mouseenter', () => {
            controlButton.style.backgroundColor = 'var(--color-grey-100)';
            icon.style.color = 'var(--color-grey-700)';
        });

        controlButton.addEventListener('mouseleave', () => {
            controlButton.style.backgroundColor = 'var(--color-white)';
            icon.style.color = 'var(--color-grey-500)';
        });

        controlButton.addEventListener('click', () => {
            if (address) {
                const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
                window.open(directionsUrl, '_blank');
            } else if (lat && lng) {
                const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                window.open(directionsUrl, '_blank');
            }
        });

        return controlButton;
    };

    const onMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
        markerRef.current = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat, lng },
            title: 'Location'
        });

        if (getDirectionButton && !directionsControlRef.current) {
            const directionsControlDiv = document.createElement('div');
            const directionsControl = createDirectionsControl(map);
            directionsControlDiv.appendChild(directionsControl);

            map.controls[google.maps.ControlPosition.TOP_LEFT].push(directionsControlDiv);
            directionsControlRef.current = directionsControlDiv;
        }
    };

    return isLoaded ? (
        <div className={styles.mapWrapper} style={customStyles}>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat, lng }}
                zoom={14}
                options={options}
                onLoad={onMapLoad}
            />
        </div>
    ) : null;
};

export default Map;
