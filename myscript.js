const width = 1000;
const height = 700;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

const link = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"



const req = new XMLHttpRequest();
      req.open("GET",link, true);
      req.send();

      req.onload=function(){
        
        const json = JSON.parse(req.responseText);
        
        const x = d3.scaleLinear()    
          .domain([
                  d3.min(json,(d) =>d.Year),
                  d3.max(json,(d) =>d.Year)
                  ])
          .range([marginLeft, width - marginRight]);         
        
          var date = new Date(0);
          
          const y = d3.scaleLinear()
          .domain([
                  d3.min(json,(d)=>d.Seconds/60),
                  d3.max(json,(d)=>d.Seconds/60)
                  ])
          .range([height - marginBottom, marginTop]); 
        
        
        var svg = d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height+100])
          .attr("style", "max-width: 100%; height: auto;");
        
         
        svg.append("g")
            .attr("id","x-axis")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("y")));
        
        svg.append("text")
          .text("Time in minutes")
          .attr("transform", "translate(5," + (height / 2) + ") rotate(-90)")
          .style("font-size","20px")
          .attr("class","label");
        
          svg.append("g")
            .attr("id","y-axis")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).tickArguments([6,"s"]));  
        
        svg.append("rect")
              .attr("x",750)
              .attr("width", 25)
              .attr("y", 400)
              .attr("height", 25)
              .attr("fill", "orange")
              .attr("opacity",".7");
        svg.append("rect")
              .attr("x",750)
              .attr("width", 25)
              .attr("y", 430)
              .attr("height", 25)
              .attr("fill", "blue")
              .attr("opacity",".7");
        svg.append("text")
          .text("Riders with doping allegations")
          .attr("x",780)
          .attr("y",418);
        svg.append("text")
          .text("Riders with no doping allegations")
          .attr("x",780)
          .attr("y",450);
        
        var tooltip = d3.select("body")
          .append("div")
          .style("position", "absolute")
          .style("z-index", "10")
          .style("visibility", "hidden")
          .attr("id","tooltip");
        
        svg.append("g")
          svg.selectAll("circle")
            .data(json)
            .enter().append("circle")
              .attr("class", "circle")
              .attr("cx", function (d) { return x(d.Year); } )
              .attr("r", 8)
              .attr("opacity",".7")
              .attr("stroke","black")
              .attr("cy", function (d,i) { return y(d.Seconds/60); } )
              .attr("fill", (d) => {if (d.Doping) return "orange"; else return "blue";})
              .on("mouseover", function(d){
                    document.querySelector('#tooltip').innerText = (d.Name + ": " + d.Nationality  + " \nYear:" + d.Year + ", Time:" +d.Time + "\n " + d.Doping );
                    return tooltip.style("visibility", "visible");
                })
              .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
              .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
      }
