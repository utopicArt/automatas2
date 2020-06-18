$(document).ready(function(){
    var requireField=true;
    $('body').css('animation','fadeEffect 3s');
    var num_estados;
    var num_entradas;
    var rojo = new Array();
    var azul = new Array();
    var verde;
    var estadoInicial;
    var estadoAceptacion;
    var edo = new Array();
    const enGlobal = /((->)|[\*]|[,])/;

    /*
        const chunkLove = /([']|["]|[=]|[(-)]|[--]|[==])/;
        
        if (!chunkLove.test($("#getUsr").val())&&!chunkLove.test($("#getPss").val())) {}
    */
    /*
        |--------|--------|--------|-------|
        |        | ROJO   |  ROJO  |  ROJO |
        |        |        |        |       |
        |________|________|________|_______|
        |        |        |        |       |
        |  AZUL  |  VERDE | VERDE  | VERDE |
        |________|________|________|_______|
        |        |        |        |       |
        |  AZUL  |  VERDE | VERDE  | VERDE |
        |________|________|________|_______|
        |        |        |        |       |
        |  AZUL  |  VERDE | VERDE  | VERDE |
        |________|________|________|_______|        
        
    */
    

    $('button').click(function(){
        num_estados = parseInt($('#num-estados').val());
        num_entradas = parseInt($('#num-entradas').val());
        requireField = (num_estados>0?false:true);
        requireField = (num_entradas>0?false:true);
        if(!requireField){
            setAFND();
        }else{
            alert("Complete todos los campos");
        }
    });
    
    function setAFND(){
        $('.main').fadeOut(500);
        $('.table-container').fadeIn(500);
        for(var i=0;i<num_entradas;i++){
            $('#thead').append("<th><input type=\"text\" id=\"base-"+i+"\"/></th>");
        }
        for(var i=0;i<num_estados;i++){
            $('.table-left table').append("<tr id=\"a-"+i+"\">"+createContainer(num_entradas)+"</tr>");
        }
    }

    function createContainer(num){
        var temp;
        for(var it=0;it<=num;it++){
            temp += "<td><input type=\"text\" id=\"estado-"+it+"\" autocomplete=\"nope\"></td>";
        }
        return temp;
    }
    var inputSize = 0;
    $(document).on('keyup', '.table-left input', function(){
        inputSize = $(this).val().length;
        if(inputSize<=1){
           if($(this).val()=='-'){
              $(this).val("->");
            }
        }
    });
    
    $(".arrow").click(guardar_posiciones);
    
    function guardar_posiciones(){
        azul = [];
        rojo = [];
        verde = [];
        //<Limpiar tabla de la derecha>
        $("#tright th").remove();
        $(".table-right tr:not(:first-child)").remove();
        $("#tright").append("<th></th>");
        //</Limpiar tabla de la derecha>
        
        verde = new Array(new Array(num_estados), new Array(num_entradas));
        //guarda la base de arriba
        for(var i=0;i<num_entradas;i++){
            rojo.push($(".table-left th #base-"+i).val());
        }
        //guarda la columna de la izquiera
        for(var i=0;i<num_estados;i++){
            azul.push($(".table-left #a-"+i+" #estado-0").val());
        }
        //Guarda las filas
        for(var i=0;i<num_estados;i++){
            verde[i] = new Array(num_estados);
            for(var j=0;j<num_entradas;j++){
                var temp = $(".table-left #a-"+i+" #estado-"+(j+1)).val();
                verde[i][j]= (temp!=null?temp:"");
                temp=undefined;delete(temp);
                //console.log("["+i+"]["+j+"].- "+ verde[i][j]);
            }
        }
        for(var i=0;i<num_entradas;i++){ 
            $("#base_right-"+i).val(rojo[i]);   
        }
        verificarEdoInicial();
    }
    
    function verificarEdoInicial(){
        var initStateFlag = false;
        var acceptStateFlag = false;        
        
        //console.clear();
        for(var i=0;i<num_estados;i++){
            if($(".table-left #a-"+i+" #estado-0").val().length>=2){
                if($(".table-left #a-"+i+" #estado-0").val().substring(0,2)=='->'){
                    var largo = parseInt($(".table-left #a-"+i+" #estado-0").val().length);
                    estadoInicial = $(".table-left #a-"+i+" #estado-0").val().substring(largo-1,largo);
                    largo=undefined;delete(largo);
                    initStateFlag = true;
                }else if($(".table-left #a-"+i+" #estado-0").val().substring(0,1)=='*'){
                    var largo2 = parseInt($(".table-left #a-"+i+" #estado-0").val().length);
                    acceptStateFlag = true;
                    estadoAceptacion = $(".table-left #a-"+i+" #estado-0").val().substring(largo2-1,largo2);
                    largo2 = undefined;delete(largo2);
                }
            }
        }
        if(initStateFlag&&acceptStateFlag){
            verificarEstados();
        }else{
            alert("[!]Asegúrese de haber indicado el estado inicial y el o los estados de aceptación.");
        }
    }
    
    function verificarEstados(){
        var flag = false;
        verde.forEach(item1 =>{
            item1.forEach(buscar =>{
                azul.forEach(en =>{
                    if(buscar.replace(enGlobal,"")==en.replace(enGlobal,"")&&buscar.length>0&&!flag){
                        console.log("Se encontró en estado");
                        flag = true;
                    }else{
                        console.log(buscar+".- "+(flag?"":"No")+" pertenece a "+en);
                    }
                });
                console.log(flag);
                flag=false;
            });
        });
    }

});






    /*function stepOne(){
        //Agrega el header
        for(var i=0;i<num_entradas;i++){
            $('#tright').append("<th>"+rojo[i]+"</th>");
        }
        //<Agrega la columna izquiera>
        for(var i=0;i<num_estados;i++){
            $(".table-right tbody").append("<tr><td>"+azul[i]+"</td></tr>");
        }
        //nuevoEstado();
        //</Agrega la columan iquierda>
        //<Ahora si viene lo chido>
        $(".table-right tbody tr:nth-child(2)").append("<td>"+verde[0][(num_entradas-1)]+"</td>");
        $(".table-right tbody tr:nth-child(2)").append("<td>"+verde[0][(num_entradas)]+"</td>");
        $(".table-right tbody tr:nth-child(3)").append("<td>"+verde[1][(num_entradas)]+"</td>");
        for(var i=2;i<num_estados;i++){
            $(".table-right tbody tr:nth-child("+(i+1)+")").append("<td>"+verde[(i-1)][1]+"</td>");  
        }
        $(".table-right tbody tr:last-child").append("<td>"+verde[0][1]+verde[1][1]+"</td>");
        $(".table-right tbody tr:last-child").append("<td>"+verde[0][(num_entradas)]+verde[1][(num_entradas)]+"</td>");
        //</Ahora si viene lo chido>
        var dato;
        checarEstado();
    }*/