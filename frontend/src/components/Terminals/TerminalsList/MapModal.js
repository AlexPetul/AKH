import React, {Component} from 'react';


class MapModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            terminals: [],
            showLoader: false,
            showTerminalCard: false,
            terminalDetails: null,
            geoCoords: [],
            mapToken: 'pk.eyJ1IjoiYWxleHBldHVsIiwiYSI6ImNrN2t4d203cDAyODczbG10MWV5OW81eTYifQ.QiHe1vd_4ugNwU7m51WmTg'
        }
    }

    componentDidMount() {
        mapboxgl.accessToken = this.state.mapToken;

        var map = new mapboxgl.Map({
            container: 'map',
            center: [37.6156, 55.7522],
            zoom: 12,
            bearing: 0,
            style: 'mapbox://styles/mapbox/streets-v11'
        });

        map.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
            })
        );

        if (this.props.lat !== null) {
            let el = document.createElement('div');
            el.className = 'marker';
            new mapboxgl.Marker(el)
                .setLngLat([this.props.lat, this.props.long])
                .addTo(map);
        }

        map.on('click', (e) => {
            this.setState({
                geoCoords: [e.lngLat.wrap().lng, e.lngLat.wrap().lat],
            });

            let markers = document.getElementsByClassName('marker');
            for (let markerIndex = 0; markerIndex < markers.length; markerIndex++) {
                markers[markerIndex].style.display = 'none'
            }

            let el = document.createElement('div');
            el.className = 'marker';
            new mapboxgl.Marker(el)
                .setLngLat(this.state.geoCoords)
                .addTo(map);
        })
    }

    render() {
        return (
            <div className="modal active">
                <div className="modal__container">
                    <div className="modal__block" style={{'minWidth': '80%'}}>
                        <div id='map' style={{'width': '100%', 'height': '500px'}}></div>
                        <div className="form__submit">
                            <input type="submit" className="button" onClick={e => {
                                e.preventDefault();
                                this.props.saveCoordinates(this.state.geoCoords)
                            }} value={window.pageContent['add_terminal_save'][this.props.currentLanguage]}/>
                            <div className="cansel">
                                <a href="" style={{'float': 'right'}} type="button" onClick={e => {
                                    e.preventDefault();
                                    this.props.closeMap()
                                }}>{window.pageContent['add_terminal_back'][this.props.currentLanguage]}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MapModal;