import * as Plotly from 'plotly.js/src/core';
import { Injectable } from '@angular/core';
declare let require: any;
Plotly.register([
  require('plotly.js/lib/pie'),
  require('plotly.js/lib/choropleth'),
  require('plotly.js/lib/bar'),
  require('plotly.js/lib/scattergeo'),
  require('plotly.js/lib/scatter'),
  require('plotly.js/lib/candlestick')
]);

@Injectable()
export class GraphService {
  public Plotly;
  constructor() {
    this.Plotly = Plotly;
  }
  //=======================================
  //=======================================
  public plotGraph(graphDiv, graphData) {
    var layout = {
      autosize: true,
      showlegend: true,
      xaxis: {
        autorange: true
      },
      yaxis: {
        autorange: true,
        type: 'linear'
      },
      font: {
        color: '#000',
        size: 12
      }
    };

    Plotly.plot(graphDiv, graphData, layout);
  }
  //=======================================
  //=======================================

}
