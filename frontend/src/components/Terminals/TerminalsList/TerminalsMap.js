import React, {Component} from 'react'
import API from "../../../services/api";
import Loader from "../../../controls/Loader";
import TerminalMapCard from "./TerminalMapCard";


class OwnerTerminalsMap extends Component {
    constructor() {
        super()
        this.state = {
            terminals: [],
            showLoader: false,
            showTerminalCard: false,
            terminalDetails: null,
            mapToken: 'pk.eyJ1IjoiYWxleHBldHVsIiwiYSI6ImNrN2t4d203cDAyODczbG10MWV5OW81eTYifQ.QiHe1vd_4ugNwU7m51WmTg'
        }
    }

    componentDidMount() {
        this.setState({showLoader: true}, () => {
            API.get('getTerminals')
                .then(response => {
                    let terminals = response.data.data.list;
                    mapboxgl.accessToken = this.state.mapToken;

                    var map = new mapboxgl.Map({
                        container: 'map',
                        center: [terminals.length ? terminals[0].latitude: 37.6156, terminals.length ? terminals[0].longitude : 55.7522],
                        zoom: 12,
                        bearing: 0,
                        style: 'mapbox://styles/mapbox/streets-v11'
                    });

                    let terminalCoords = [];
                    for (let index = 0; index < terminals.length; index++) {
                        terminalCoords.push(
                            {
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [terminals[index].latitude, terminals[index].longitude]
                                }
                            }
                        )
                    }

                    const context = this;

                    for (let index = 0; index < terminalCoords.length; index++) {
                        let el = document.createElement('div');
                        el.className = 'marker terminalid-' + terminals[index].id;
                        el.addEventListener('click', function () {
                            context.setState({
                                showTerminalCard: true,
                                terminalDetails: terminals[index]
                            })
                        }, false);

                        new mapboxgl.Marker(el)
                            .setLngLat(terminalCoords[index].geometry.coordinates)
                            .addTo(map);
                    }

                    this.setState({showLoader: false});
                    this.props.setListHandler(terminals)
                });
        });
    }

    closeTab = () => {
        this.setState({showTerminalCard: false});
    };

    updateTerminalsList(list) {
        let markers = document.getElementsByClassName('marker');
        for (let markerIndex = 0; markerIndex < markers.length; markerIndex++) {
            markers[markerIndex].style.display = 'block'
        }

        for (let markerIndex = 0; markerIndex < markers.length; markerIndex++) {
            let currentMarker = markers[markerIndex];
            let wasFound = false;
            for (let tIndex = 0; tIndex < list.length; tIndex++) {
                let currentClassName = "terminalid-" + list[tIndex].id;
                if (currentMarker.classList[1] === currentClassName) {
                    wasFound = true;
                    break
                }
            }
            if (!wasFound) {
                currentMarker.style.display = 'none';
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.state.showTerminalCard
                    ?
                    <TerminalMapCard
                        currentLanguage={this.props.currentLanguage}
                        terminal={this.state.terminalDetails}
                        closeTab={this.closeTab}
                    />
                    :
                    null
                }
                <div id='map' style={{'width': '100%', 'height': '700px'}}></div>
                <Loader showLoader={this.state.showLoader}/>
            </React.Fragment>
        )
    }
}

export default OwnerTerminalsMap