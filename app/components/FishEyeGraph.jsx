// 'use client';

// import React, { useState, useEffect, useRef } from "react";
// import { Graph, Fisheye } from "@antv/g6";
// import { parseFish } from "../parsers/fishEyeDataParser";
// import { JsonData } from "../parsers/jsonPharser";

// let data = {nodes:[], edges : []};
// const initData = JsonData
// const newO = JSON.parse(JSON.stringify(initData));
// data = parseFish(newO);
// let filteredNodes = {};
// let finalNodes = data.nodes
// let finalEdges = [];
// let filteredData = {};
// let clicked = false;



// class Search extends React.Component {

//   constructor() {
//     super();
//     this.state = { 
//       checkedAll: false,
//       checkedPatients: false,
//       checkedSites: false,
//       checkedCohorts: false,
//       checkedCaseStudy: false,
//     };
//     this.searchitems = data.nodes
//   }


//   hereditaryFilter() {
//     let filter =this.props.filter;
//     if(filter === "all") { 
//       if(!clicked) {
//         const filteredAll = this.searchitems;
//         filteredNodes.All = filteredAll;
//         this.state.checkedAll = true;
//         clicked = true;
//       } 
//     } else if( filter === "patient") {
//       if(!clicked) {
//         const filteredPatients = this.searchitems.filter(
//           item => item.cluster === "Patient"
//         );
//         filteredNodes.Patients = filteredPatients;
//         this.state.checkedPatients = true;
//         clicked = true;
//       }
//     } else if( filter === "site") {
//       if(!clicked) {
//         const filteredSites = this.searchitems.filter(
//           item => item.cluster === "Site"
//         );
//         filteredNodes.Sites = filteredSites
//         this.state.checkedSites = true;
//         clicked = true;
//       }
//     } else if( filter === "cohort") {
//       if(!clicked) {
//         const filteredCohorts = this.searchitems.filter(
//           item => item.cluster === "Cohort"
//         );
//         filteredNodes.Cohorts = filteredCohorts
//         this.state.checkedCohorts = true 
//         clicked = true;
//       }
//     } else if( filter === "casestudy") {
//       if(!clicked) {
//         const filteredCaseStudy = this.searchitems.filter(
//           item => item.cluster === "CaseStudy"
//         );
//         clicked = true;
//         filteredNodes.CaseStudy = filteredCaseStudy
//         this.state.checkedCaseStudy = true 
//       }
//     }
//   }

//   handleAll = () => {
//     if (this.state.checkedAll === false) {
//       const filteredAll = this.searchitems;
//       filteredNodes.All = filteredAll;
//       this.setState({ checkedAll: true});
//       clicked = true;
//     } else {
//       clicked = true;
//       this.setState({ checkedAll: false });
//     }
//   };

//   handlePatient = () => {
//     if (this.state.checkedPatients === false) {
//       const filteredPatients = this.searchitems.filter(
//         item => item.cluster === "Patient"
//       );
//       filteredNodes.Patients = filteredPatients
//       this.setState({ checkedPatients: true });
//       clicked = true;
//     } else { 
//       clicked = true;
//       filteredNodes.Patients = [];
//       this.setState({ checkedPatients: false });
//     }
//   };

//   handleSite = () => {
//     if (this.state.checkedSites === false) {
//       const filteredSites = this.searchitems.filter(
//         item => item.cluster === "Site"
//       );
//       filteredNodes.Sites = filteredSites
//       this.setState({ checkedSites: true });
//       clicked = true;
//     } else {
//       clicked = true;
//       filteredNodes.Sites = [];
//       this.setState({ checkedSites: false });
//     }
//   };

//   handleCohort = () => {
//     if (this.state.checkedCohorts === false) {
//       const filteredCohorts = this.searchitems.filter(
//         item => item.cluster === "Cohort"
//       );
//       filteredNodes.Cohorts = filteredCohorts
//       this.setState({ checkedCohorts: true });
//       clicked = true;
//     } else {
//       clicked = true;
//       filteredNodes.Cohorts = [];
//       this.setState({ checkedCohorts: false });
//     }
//   };

//   handleCaseStudy = () => {
//     if (this.state.checkedCaseStudy === false) {
//       const filteredCaseStudy = this.searchitems.filter(
//         item => item.cluster === "CaseStudy"
//       );
//       clicked = true;
//       filteredNodes.CaseStudy = filteredCaseStudy
//       this.setState({ checkedCaseStudy: true });
//     } else {
//       clicked = true;
//       filteredNodes.CaseStudy = [];
//       this.setState({ checkedCaseStudy: false });
//     }
//   };

//   handleFilter = () => {
//     let ids = {}
//     if(this.state.checkedAll) {
//       finalNodes = filteredNodes.All;
//     } else {
//       finalNodes = [];
//       for(let key in filteredNodes) {
//         if(key !== "All" && this.state["checked" + key]) {
//           finalNodes = finalNodes.concat(filteredNodes[key]);
//         }
//       }
//     }
//     for(let i = 0; i < finalNodes.length; i++) {
//       const node = finalNodes[i];
//         ids[node.id] = node
//     }
//     finalEdges = [];
//     for(let i = 0; i < data.edges.length; i ++){
//       const edge = data.edges[i];
//       const edgeStart = edge.start.id;
//       const edgeEnd = edge.end.id;
//       if (
//         ids[edgeStart] !== undefined &&
//         ids[edgeEnd] !== undefined
//       ) {
//         finalEdges.push(edge);
//       }
//     }
//     filteredData = { nodes: finalNodes, edges: finalEdges}
//   }
  
//   render() {
//     if(this.props.filter) {
//       this.hereditaryFilter()
//     }

//     this.handleFilter()
  
//     return (
//       <div className="searchContainer">
//         <form>
//         <label htmlFor="myInput">All</label>
//           <input id="myInput" type="checkbox" onClick={this.handleAll} defaultChecked = {this.state.checkedAll} />
//           <label htmlFor="myInput">Patient</label>
//           <input id="myInput" type="checkbox" onClick={this.handlePatient} defaultChecked = {this.state.checkedPatients} />
//           <label htmlFor="myInput">Site</label>
//           <input id="myInput" type="checkbox" onClick={this.handleSite} defaultChecked = {this.state.checkedSites} />
//           <label htmlFor="myInput">Cohort</label>
//           <input id="myInput" type="checkbox" onClick={this.handleCohort} defaultChecked = {this.state.checkedCohorts} />
//           {/* <label htmlFor="myInput">CaseStudy</label>
//           <input id="myInput" type="checkbox" onClick={this.handleCaseStudy} defaultChecked = {this.state.checkedCaseStudy} /> */}
//         </form>
//       </div>
//     );
//   }
// }





// export default function FishEye(props) {
  
// //   data = props.data
//   const filter = props.filter;
//   const myRef = useRef(null);
//   let [graphData, setGraphData] = useState(data);
  
//   function dataCheck() {
//     if(clicked) {
//       setGraphData(filteredData);
//       clicked = false;
//     }
//   }
 
//   useEffect(() => {
//     if (typeof window === 'undefined') return; // Skip on server-side

//     const checkInt = setInterval(dataCheck, 1);

//     let fisheye = new Fisheye({
//       r: 150,
//       d: 3,
//       showDPercent: false,
//       showLabel: true,
//       delegateStyle: {
//         stroke: "#000",
//         strokeOpacity: 0.8,
//         lineWidth: 0,
//         fillOpacity: 0,
//         fill: "",
//       },
//     });
//     const colors = ["#EC8E00", "#F65754", "#711471", "#0078C1", "#F5D547"];
//     const container = myRef.current;
//     if (!container) return;
    
//     const width = container.scrollWidth;
//     const height = container.scrollHeight || 800;
//     let size = 30

//     if(height > 1000&& width > 1000) {
//       size = 40;
//     }
//     if(height > 1500 && width > 1500) {
//       size = 50;
//     }
//     if(height > 2000 && width > 2000) {
//       size = 60;
//     }
//     if(height > 2500 && width > 2500) {
//       size = 70;
//     }
//     if(height > 3000 && width > 3000) {
//       size = 80;
//     }

//     const graphConfig = {
//       preventOverlap: true,
//       container,
//       width,
//       height,
//       plugins: [fisheye],
//       modes: {
//         default: ["drag-canvas", "zoom-canvas"],
//       },
//       defaultEdge: {
//         style: {
//           stroke: "#FFF",
//           opacity: 0,
//         },
//       },
//       defaultNode: {
//         size,
//       },
//       layout: {
//         type: "force",
//         preventOverlap: true,
//       },
//       edgeStateStyles: {
//         opacity: 1,
//         hover: {
//           opacity: 1,
//           stroke: "#0078c0",
//         },
//       },
//       nodeStateStyles: {
//         hover: {
//           opacity: 0.3,
//         },
//       },
//     }
    
//     let graph = new Graph(graphConfig);
//     graph.on("node:click", function (e) {
//       const node = e.item;
//       const currentEdges = node.getEdges();
//       const allEdges = graph.getEdges();
//       const allNodes = graph.getNodes();
//       const targetEdges = [];
//       const currentObj = {};
//       const targetNodesOBJ = {};
//       const currentNodes = [];
//       for (let i = 0; i < currentEdges.length ; i++) {
//         const edge = currentEdges[i];
//         targetNodesOBJ[edge._cfg.model.target] = edge._cfg.model.target;
//         targetNodesOBJ[edge._cfg.model.source] = edge._cfg.model.source;
//       }
//       for (let i = 0; i < allNodes.length ; i++) {
//         const node = allNodes[i];
//         if (targetNodesOBJ[node._cfg.model.id] === undefined) {
//           currentNodes.push(node);
//         }
//       }
//       for (let j = 0; j < currentEdges.length ; j++) {
//         const edge = currentEdges[j];
//         currentObj[edge._cfg.id] = edge._cfg.id;
//       }
//       for (let i = 0; i < allEdges.length ; i++) {
//         const edge = allEdges[i];
//         if (currentObj[edge._cfg.id] === undefined) {
//           targetEdges.push(edge);
//         }
//       }
//       currentNodes.forEach((node) => {
//         graph.setItemState(node, "hover", true);
//       });
//       currentEdges.forEach((edge) => {
//         graph.setItemState(edge, "hover", true);
//       });
//     });
//     graph.on("node:mouseleave", function (e) {
//       const node = e.item;
//       const allNodes = graph.getNodes();
//       const currentEdges = node.getEdges();
//       currentEdges.forEach((edge) => {
//         graph.setItemState(edge, "hover", false);
//       });
//       allNodes.forEach((edge) => {
//         graph.setItemState(edge, "hover", false);
//       });
//     });

//     const clusterMap = new Map();
//     let clusterId = 0;
//     const nodes = data.nodes;
//     nodes.forEach((node, i) => {
//       const range = [];
//       for (let i = -200; i < 201; i++) {
//         range.push(i);
//       }
//       var coordinateX = range[Math.floor(Math.random() * range.length)];
//       var coordinateY = range[Math.floor(Math.random() * range.length)];
//       node.x = coordinateX;
//       node.y = coordinateY;
//       if (node.cluster && clusterMap.get(node.cluster) === undefined) {
//         clusterMap.set(node.cluster, clusterId);
//         clusterId++;
//       }
//       const id = clusterMap.get(node.cluster);

//       if (node.style) {
//         node.style.fill = colors[id % colors.length];
//       } else {
//         node.style = {
//           fill: colors[id % colors.length],
//         };
//       }

//       const parsesomething = (name) => {

//         if (name === "Casestudy RhoneX") return "CaseStudyOne"
//         else if (name === "Casestudy Belvedere") return "CaseStudyTwo"
//         else if (name === "Casestudy Velodrome") return "CaseStudyThree"
//         else return name
//       }
//       node.label = parsesomething(node.name);
//       node.size = size;
//     });
//     graph.data(graphData);
//     graph.render();
//     graph.getNodes().forEach((node) => {
//       node
//         .getContainer()
//         .getChildren()
//         .forEach((shape) => {
//           if (shape.get("type") === "text") shape.hide();
//         });
//     });

//     if (container.childNodes.length > 1) {
//       container.childNodes[0].remove();
//     }

//     return () => {
//       clearInterval(checkInt)
//       if (graph) {
//         graph.destroy();
//       }
//     }
   
//   }, [graphData]);

//   return (
//     <div className="fishEye-container">
//       <Search filter={filter}/>
//       <div id="container-5" ref={myRef} style={{ width: '100%', height: '600px' }}></div>
//     </div>
//   );
// }
