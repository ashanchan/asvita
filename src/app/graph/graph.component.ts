import { Component, OnInit, Input } from '@angular/core';
import { GraphService } from '../services/graph.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {
  @Input() graphData;
  @Input() graphDiv;
  constructor(private graphService: GraphService) { }
  //=======================================
  //=======================================
  ngOnInit() {
    setTimeout(() => this.plotGraph(), 100);
  }
  //=======================================
  //=======================================
  private plotGraph() {
    this.graphDiv = document.querySelector("#graphDiv" + this.graphDiv + " #plotDiv")
    this.graphService.plotGraph(this.graphDiv, this.graphData);
  }
  //=======================================
  //=======================================
}
