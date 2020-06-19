$(document).ready(function(){
    var requireField=true;
    $('body').css('animation','fadeEffect 3s');
    var num_estadosNuevo;
    var num_estados;
    var num_entradas;
    var num_entradasNuevo;
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
        num_estadosNuevo = num_estados;
        num_entradas = parseInt($('#num-entradas').val());
        num_entradasNuevo = num_entradas;
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
        num_estados = parseInt($('#num-estados').val());
        num_estadosNuevo = num_estados;
        num_entradas = parseInt($('#num-entradas').val());
        num_entradasNuevo = num_entradas;
        //<Limpiar tabla de la derecha>
        console.clear();
        $("#tright th").remove();
        $(".table-right tr:not(:first-child)").remove();
        $("#tright").append("<th></th>");
        //</Limpiar tabla de la derecha>
        
        verde = new Array(new Array(num_estados), new Array(num_entradas));
        //Guarda rojo
        for(var i=0;i<num_entradas;i++){
            rojo.push($(".table-left th #base-"+i).val());
        }
        //Guarda azul
        for(var i=0;i<num_estados;i++){
            azul.push($(".table-left #a-"+i+" #estado-0").val());
        }
        //Guarda verde
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
        verde.forEach(item =>{
            item.forEach(buscar =>{
                azul.forEach(en =>{
                    if(buscar.replace(enGlobal,"")==en.replace(enGlobal,"")&&buscar.length>0&&!flag){
                        //console.log("Se encontró en estado");
                        flag = true;
                    }/*else{
                        console.log(buscar+".- "+(flag?"":"No")+" pertenece a "+en);
                    }*/
                });
                //console.log(flag);
                if(!flag&&buscar.length>0){
                    azul.push(buscar);
                    num_estadosNuevo++;
                    setearNuevo();
                }
                flag=false;
            });
        });
        agregarHeader();
    }
    
    function agregarHeader(){
        //<Agrega rojo>
        for(var i=0;i<num_entradas;i++){
            $('#tright').append("<th>"+rojo[i]+"</th>");
        }
        //</Agrega rojo>
        //<Agrega azul>
        for(var i=0;i<num_estadosNuevo;i++){
            $(".table-right tbody").append("<tr><td>"+azul[i]+"</td></tr>");
        }
        //</Agrega azul>
        //<Agrega verde>
        for(var i=2;i<num_estadosNuevo;i++){
            for(var j=0;j<num_entradasNuevo;j++){
                $(".table-right tbody tr:nth-child("+i+")").append("<td>"+verde[(i-2)][j]+"</td>");                  
            }
        }        
        //</Agrega verde>
    }
    
    var nuevo;
    var actual;
    var rojoAvance;
    var rojoAvance2;
    function setearNuevo(){
        var largoAzul = parseInt(azul.length);
        largoAzul = largoAzul-1;
        rojoAvance=0;
        rojoAvance2=0;
        var setIn = parseInt(num_estadosNuevo);
        setIn=setIn-1;
        var verdeTemporal = verde;
        verde = new Array(new Array(num_estadosNuevo), new Array(num_entradas));
        verde = verdeTemporal;
        console.log(verde);
        
        //<Obtener el largo del ultimo elemento en azul>
        verde[setIn] = new Array(num_entradasNuevo);
        for(var i=0;i<num_entradasNuevo;i++){
            nuevo="";
            //rojoAvance2=i
            rojoAvance=i;
            for(var estado of azul[largoAzul]){
                actual = estado;
                azul.forEach(verificarNuevo);            
            }
            //$(".table-right tbody").append("<tr><td>"+nuevo+"</td></tr>");
            //console.log($(".table-right tbody tr:nth-child("+num_estadosNuevo+")").val());
            //$(".table-right tbody tr:last-child").append("<td>"+nuevo+"</td>");
            console.log("El valor en 0 equivale a --["+nuevo+"]--");
            console.log("Se trató de setear ["+setIn+"]["+i+"]");            
            verde[setIn][i] = nuevo;
            console.log(verde);
            //setIn++;
        }
        //</Obtener el largo del ultimo elemento en azul>
    }
    
    //Función que buscará el nuevo par ordenado en los estados
    function verificarNuevo(estado, index){
        //console.log("El dato "+estado+"\nSe encuentra en el indice["+index+"]");
        if(actual==estado.replace(enGlobal,"")){
            nuevo+=verde[index][rojoAvance];
            console.log("Verde["+index+"][0] equivale a: "+verde[index][rojoAvance]);
        }else{
            nuevo+="";
        }
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