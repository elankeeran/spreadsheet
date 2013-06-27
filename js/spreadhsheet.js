(function(){
  
  window.echo = console.log.bind(console);

  /* root namespace */
  var app = app || {};

  /* our data model */
  var data = [];

  app = {
    init : function(){
      app.initData();
      /* register event listeners */
      var main = document.getElementById('main');
      main.addEventListener('click', app.handleClick, false);
      app.render();
    },

    initData : function(){
      var rowCount = 9, columnCount = 9, i, j, row, column;
      for( i = 0; i < rowCount; i++){
        data[i] = new Array(columnCount);
        row = data[i];
        for(j=0; j<row.length; j++){
          row[j] = "" ;
        }
      }
    },

    render : function(){
      var i,j, row, column, cell, rowEl;
      var main = document.getElementById('main');
      main.innerHTML = '';
      rowEl = document.createElement('div');
      rowEl.className = 'row';
      for(j=-1; j<data[0].length; j++){
          cell = document.createElement('article');
          cell.className = 'heading';
          cell.setAttribute('data-c', j );
          cell.innerHTML = '<span class="lCol hd" title="Insert new column left">&larr;</span> <span class="delCol hd" title="Delete column">-</span> <span class="hd rCol" title="Insert new column right">&rarr;</span>';
          rowEl.appendChild(cell);
      }
      main.appendChild(rowEl);
      for(i=0; i<data.length; i++){
        rowEl = document.createElement('div');
        rowEl.className = 'row';
        row = data[i];
        for(j=-1; j<row.length; j++){
          cell = document.createElement('article');
          if(j === -1){
            cell.setAttribute('data-r', i);
            cell.className = 'heading';
            cell.innerHTML = '<span class="hd uRow" title="Insert new row up">&uarr;</span> <span class="hd delRow" title="Delete row">-</span> <span class="hd dRow" title="Insert new row down">&darr;</span>';
            rowEl.appendChild(cell);
          }else{
            cell.className = 'cell';
            cell.innerHTML = row[j];
            cell.setAttribute('id', i + '-' + j);
            cell.setAttribute('data-r', i);
            cell.setAttribute('data-c', j);
          }
          rowEl.appendChild(cell);
        }
        main.appendChild(rowEl);
      }
    },

    handleClick : function(event){
      var target = event.target;
      var main = document.getElementById('main');
      if(app.hasClass(main, 'editing')){
        var celltext = document.querySelector('.cell input');
        app.setData(celltext.value, celltext.getAttribute('data-for'));
        main.className = '';
        document.getElementById(celltext.getAttribute('data-for')).innerHTML = celltext.value;
      }else{
        if(app.hasClass(target, 'cell')){
          main.className = 'editing';
          var inp = document.createElement('input');
          inp.setAttribute('type', 'text');
          inp.setAttribute('class', 'celltext');
          inp.setAttribute('value', app.getData(target.getAttribute('data-r'), target.getAttribute('data-c')));
          inp.setAttribute('data-for', target.getAttribute('id'));
          target.innerHTML = '';
          target.appendChild(inp);
          inp.focus();
        }else if(app.hasClass(target, 'hd')){
          var i, j, row, column;
          var parent = target.parentNode;
          if(app.hasClass(target, 'lCol')){
            var c = parent.getAttribute('data-c');
            for(i=0; i< data.length; i++){
              row = data[i];
              tmpRow = [];
              for(j=0; j < row.length; j++){
                if(c == j){
                  tmpRow.push(' ');
                }
                tmpRow.push(row[j]);
              }
              data[i] = tmpRow;
            }
          }else if(app.hasClass(target, 'rCol')){
            var c = parseInt(parent.getAttribute('data-c'));
            for(i=0; i< data.length; i++){
              row = data[i];
              tmpRow = [];
              for(j=0; j < row.length; j++){
                if(c + 1 == j ){
                  tmpRow.push(' ');
                }
                tmpRow.push(row[j]);
              }
              if(c + 1 == row.length){
                tmpRow.push(' ');
              }
              data[i] = tmpRow;
            }
          }else if(app.hasClass(target, 'delCol')){
            echo('gonna delete');
            var c = parseInt(parent.getAttribute('data-c'));
            for(i=0; i< data.length; i++){
              row = data[i];
              tmpRow = [];
              for(j=0; j < row.length; j++){
                if(c != j ){
                  tmpRow.push(row[j]);
                }
              }
              data[i] = tmpRow;
            }
          }else if(app.hasClass(target, 'uRow')){
            var i, j, tmpData = [], row=[];
            var r = parseInt(parent.getAttribute('data-r'));
            for(i=0; i < data.length; i++){
              if( r == i){
                for(j=0; j < data[0].length; j++){
                  row.push(' ');
                }
                tmpData.push(row);
              }
              tmpData.push(data[i]);
            }
            data = tmpData;
          }else if(app.hasClass(target, 'dRow')){
            var i, j, tmpData = [], row=[];
            var r = parseInt(parent.getAttribute('data-r'));
            for(i=0; i < data.length; i++){
              if( r+1 == i){
                for(j=0; j < data[0].length; j++){
                  row.push(' ');
                }
                tmpData.push(row);
              }
              tmpData.push(data[i]);
            }
            if( r+1 == data.length){
              for(j=0; j < data[0].length; j++){
                  row.push(' ');
                }
                tmpData.push(row);
            }
            data = tmpData;
          }else if(app.hasClass(target, 'delRow')){
            var i, j, tmpData = [], row=[];
            var r = parseInt(parent.getAttribute('data-r'));
            for(i=0; i < data.length; i++){
              if( r != i){
                tmpData.push(data[i]);
              }
            }
            data = tmpData;
          }
          app.render();
        }
      }
    },

    hasClass : function(element, cls){
      return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    },

    getData : function(r,c){
      return data[r][c];
    },

    setData : function(d, id){
      var rc = id.split('-');
      data[rc[0]][rc[1]] = d;
    },

    printData : function(){
      var i, j;
      for(i=0; i<data.length; i++){
        var row = data[i];
        for(j=0; j<row.length; j++){
          echo(row[j] );
        }
        echo('\n');
      }
    }
  };

  app.init();

}());