import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { MessageService } from './../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { GraphService } from '../services/graph.service';
import { PieGraphModel } from './../model/pie.graph.model';
import { BarGraphModel } from './../model/bar.graph.model';
import { TimeLineGraphModel } from './../model/timeline.graph.model';
import { LayoutGraphModel } from './../model/layout.graph.model';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {
  public tabs: Array<string> = [];
  public subscription: Subscription;
  public tabId: number = 0;
  public graphs: any = [];
  public graphId: number = 0;
  public graphData: any;
  public graphLayout: any;
  public graphTitle: string;
  public alertTip: string = '';
  public formDisabled: boolean = true;
  public tableData: any = [];
  public tableLabel: any = [];
  public tableCol: any = [];
  public trivia: string = '';

  private model: any = {};

  @ViewChild('graphForm') form: any;

  constructor(private graphService: GraphService, private dataService: DataService, private messageService: MessageService) { }

  //=======================================
  //=======================================
  public ngOnInit(): void {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });

    this.tabs = ['Add Record', 'View Record', 'Plot Record'];
    this.graphs.push({ title: 'Weight', icon: 'fa fa-balance-scale' });
    this.graphs.push({ title: 'Sugar', icon: 'fa fa-battery-half' });
    this.graphs.push({ title: 'BP', icon: 'fa fa-heartbeat' });
    this.graphs.push({ title: 'Temperature', icon: 'fa fa-thermometer-half' });
    this.graphTitle = this.graphs[this.graphId].title;
  }
  //=======================================
  //=======================================
  private onMessageReceived(message: any): void {
    switch (message.event) {
      case 'onGraphDataRecd':
        this.processData(message.data);
        break;
    }
  };
  //=======================================
  //=======================================
  private processData(data) {
    if (this.tabs[this.tabId] === "Plot Record") {
      this.getGraphData(data);
    }
    else {
      this.setTableData(data.data);
    }
    this.getTrivia();
  };

  //=======================================
  //=======================================
  public onTabClicked(id: number): void {
    this.tabId = id;
    if (this.tabs[this.tabId] !== "Add Record") {
      this.onGraphClicked(0);
    }
  }
  //=======================================
  //=======================================
  private onGraphClicked(idx: number) {
    this.graphId = idx;
    this.alertTip = '';
    this.graphTitle = this.graphs[this.graphId].title;
    if (this.tabs[this.tabId] !== "Add Record") {
      this.model = {};
      this.model.graphType = String(this.graphs[this.graphId].title).toLowerCase();
      this.messageService.sendMessage({ event: 'onGetGraph', data: { model: this.model } });
    }
  }
  //=======================================
  //=======================================
  private getGraphData(data) {
    this.graphData = [];
    this.graphLayout = new LayoutGraphModel().layout;
    let plotData, plot = [], label, dataCtr, lblCtr, i, j = null;
    delete this.graphLayout['xaxis'];
    delete this.graphLayout['yaxis'];

    plotData = data.data;
    dataCtr = plotData.length;
    label = Object.keys(plotData[0]);
    label.shift();
    lblCtr = label.length;

    for (i = 0; i < lblCtr; i++) {
      plot[i] = new TimeLineGraphModel();
      plot[i].data.name = this.dataService.titleCase(label[i]);
    }

    let rDt: any;
    for (i = 0; i < dataCtr; i++) {
      for (j = 0; j < lblCtr; j++) {
        plot[j].data.x.push(plotData[i].recDate);
        plot[j].data.y.push(plotData[i][label[j]]);
      }
    }

    for (i = 1; i < lblCtr; i++) {
      this.graphData.push(plot[i]);
    }

    let graphDiv = document.querySelector("#graphDiv #plotDiv");
    try {
      this.graphService.deleteGraph(graphDiv);
    }
    catch (e) {
    }
    finally {
      setTimeout(() => this.plotGraph(), 100);
    }
  }
  //=======================================
  //=======================================
  private plotGraph() {
    let graphDiv = document.querySelector("#graphDiv #plotDiv");
    this.graphService.plotGraph(graphDiv, this.graphData, this.graphLayout);
  }
  //=======================================
  //=======================================
  private setTableData(plotData) {
    this.tableData = plotData;
    this.tableCol = Object.keys(plotData[0]);
    this.tableCol.push('Edit');
    this.tableCol.push('Delete');
    this.tableLabel = [];
    let ctr = this.tableCol.length;
    for (let i = 0; i < ctr; i++) {
      this.tableLabel[i] = this.dataService.titleCase(this.tableCol[i]);
    }

    ctr = this.tableData.length;
    for (let i = 0; i < ctr; i++) {
      this.tableData[i]['recDate'] = this.convertDate(this.tableData[i]['recDate']);
    }
  }
  //=======================================
  //=======================================
  public onSubmit() {
    this.alertTip = '';
    if (this.form.valid) {
      this.formDisabled = true;
      let success = this.validator();
      if (!success) {
        this.alertTip = 'Enter Valid field values for accurate plotting';
      }
      else {
        this.messageService.sendMessage({ event: 'onGraphSubmit', data: { model: this.model } });
      }
    }
  }
  //=======================================
  //=======================================
  public validator() {
    let title = String(this.graphs[this.graphId].title).toLowerCase();
    this.model = {};
    this.model['graphType'] = title;
    this.model['recDate'] = (<HTMLInputElement>document.getElementById('graphDate')).value;
    switch (title) {
      case 'weight':
        this.model['height'] = Number((<HTMLInputElement>document.getElementById('height')).value);
        this.model['weight'] = Number((<HTMLInputElement>document.getElementById('weight')).value);
        break;
      case 'sugar':
        this.model['fasting'] = Number((<HTMLInputElement>document.getElementById('fasting')).value);
        this.model['normal'] = Number((<HTMLInputElement>document.getElementById('normal')).value);
        break;
      case 'bp':
        this.model['systolic'] = Number((<HTMLInputElement>document.getElementById('systolic')).value);
        this.model['diastolic'] = Number((<HTMLInputElement>document.getElementById('diastolic')).value);
        this.model['pulse'] = Number((<HTMLInputElement>document.getElementById('pulse')).value);
        break;
      case 'temperature':
        this.model['temperature'] = Number((<HTMLInputElement>document.getElementById('temperature')).value);
        break;
    }
    //===
    let success = true;
    for (let j in this.model) {
      if (this.model[j] === '' || this.model[j] === 0) {
        success = false;
      }
    }
    return success;
  }
  //=======================================
  //=======================================
  private getTrivia() {
    this.trivia = this.dataService.getGraphTrivia(String(this.graphs[this.graphId].title).toLowerCase());
  }
  //=======================================
  //=======================================
  private convertDate(dt) {
    let nDt = String(new Date(dt)).split(' ');
    nDt.shift();
    return nDt[0] + ' ' + nDt[1] + ' ' + nDt[2] + ' ' + nDt[3];
  }
  //=======================================
  //=======================================
  public updateRecord(idx, mode) {
    alert(this.tableData[idx]['_id']);
  }
  //=======================================
  //=======================================

}

