/** 
 * @file: agilone.js
 * @abstract: Interactive Graphing for Agilone
 * @author: Henry Lubong
 *
 *
 * You will notice that jQuery was used for this application only
 * for DOM traversal/manipulations
 *
 */

var AGILONE = AGILONE || {};

AGILONE.intgraph = (function() {
	var rowNum = 0,
	    lineGraph = $('#line-graph')[0], //jquery saves the canvas properties in index 0
	    dataInput = $('#data-input'),

      lineGraphWidth = lineGraph.width,
      lineGraphHeight = lineGraph.height,
	
      graphColors = ['#ff0000','#0000ff','#008000','#ff00ff','#ff6600'];

	return {
    init: function() {
      this.data = [];
    	this.allXs = [];
    	this.allYs = [];
    	this.maxX = null;
    	this.maxY = null;
    	
    	//event listeners
      $('#btn-add-row').bind('click', this.addNewRow);
      $('#btn-refresh-graph').bind('click', {obj: this}, this.refreshGraph);
      $(lineGraph).bind('mouseover', {obj: this}, this.refreshGraph);
    },

		addNewRow: function(event) {
      rowNum++;

      var cloned = $('.row-template').clone().removeClass('row-template').appendTo(dataInput);
		  
		  //do not copy the values of the cloned row
		  $(cloned).find('input').val(''); 

      //add an alternating background for rows
      if (rowNum % 2 == 1) {
        $(cloned).addClass('even');
      }
		},
		
		refreshGraph: function(event) {
      var that = event.data.obj;

      var data = that.setData();
      
      that.buildLineGraph(data);
      
		},
		
		buildLineGraph: function(data) {
      var i,
          rowLength = this.data.length,
          ctx = lineGraph.getContext('2d'),
          xOffset = 10,
          yOffset = 20;
    
      //clears the whole canvas to prepare for repainting
      ctx.clearRect(0, 0, lineGraphWidth, lineGraphHeight); 
      
      ctx.fillStyle = '#eee';
      ctx.fillRect(0,0,lineGraphWidth,lineGraphHeight);
 
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#333';
      ctx.moveTo(xOffset, lineGraphHeight - yOffset);
      ctx.lineTo(xOffset, yOffset);
      ctx.moveTo(xOffset, lineGraphHeight - yOffset);
      ctx.lineTo(lineGraphWidth - xOffset, lineGraphHeight - yOffset);
      ctx.stroke();
 
      for (i = 0; i < rowLength; i++) {
        var j,
            colLength = this.data[i].length,
            x = this.data[i][0].x
            realX = this.getRealX(x);

        /*
          draw the x-axis labels
        */
        ctx.fillStyle = '#f00';
        ctx.font = 'italic bold 10px sans-serif';
        ctx.textBaseline = 'bottom';
        ctx.fillText(x, realX - xOffset, lineGraphHeight - 5);
      
        /*
          begin drawing the lines and data points
        */
        var k = 0;
        
        for (j = 0; j < colLength; j++) {
          var realY = this.getRealY(this.data[i][j].y);
          
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = graphColors[j];
          ctx.moveTo(realX + k, lineGraphHeight - yOffset);
          ctx.lineTo(realX + k, realY);
          ctx.stroke();

          /*ctx.beginPath();
          ctx.fillStyle = graphColors[i];
          ctx.arc(realX, realY, 4, 0, Math.PI * 2, true);
          ctx.fill();
          */
          
          k = k + 10;
        }    
      }    
		},
		
		getData: function() {
		  return this.data;
		},
		
		getRealX: function(x) {
		  var ratio = x / this.maxX;
		  
		  var realX = (lineGraphWidth - 20) * ratio;
		  
		  return realX;
		  
		},
		
		getRealY: function(y) {
		  var ratio = y / this.maxY;
		  
		  var realY = lineGraphHeight * ratio;
		  
      //revert the axis because 0 in canvas starts from top
      realY = (lineGraphHeight + 20) - realY;
		
		  return realY;
		},

		setData: function() {
		  var row = $('#data-input .data-row'),
		      i,
		      rowLength = row.length;
		  
		  for (i = 0; i < rowLength; i++) {
		    var dataX = $(row[i]).find('input.data-x')[0],
		        dataY = $(row[i]).find('input.data-y'),
		        j,
		        dataYLength = dataY.length;
		    
		    this.data[i] = [];
		    
		    for (j = 0; j < dataYLength; j++) {
          this.data[i][j] = {x: $(dataX).val(), y: $(dataY[j]).val()}
		    
		      this.allYs.push($(dataY[j]).val());
		    }
		    
		    this.allXs.push($(dataX).val());
		  }

      this.maxX = Math.max.apply(Math, this.allXs);
      this.maxY = Math.max.apply(Math, this.allYs);
		}
	}
}()).init();



