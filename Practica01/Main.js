window.addEventListener("load", function(evt){
    let canvas = this.document.getElementById("the_canvas");
    let context = canvas.getContext("2d");

    let r = this.document.getElementById("r");
    let r_rango = this.document.getElementById("r_rango");
    let k = this.document.getElementById("k");
    let k_rango = this.document.getElementById("k_rango");
    let vueltas = this.document.getElementById("vueltas");
    let vueltas_rango = this.document.getElementById("vueltas_rango");
    
    //Valores para centrar el epicicloide
    let xcentro = canvas.width/2;
    let ycentro = canvas.height/2;

    //Se agregan manejadores de eventos para interactuar con el dibujo del canvas

    //Actualizamos valor de r y r_rango
    r.addEventListener("input", function(evt){
        
        let val = parseFloat(r.value);
        if(isNaN(val)){
            r.value = 0;
        }
        r_rango.value = r.value;
        
        draw();

    });

    //Actualizamos valor de r_rango y r
    r_rango.addEventListener("input", function(evt){

        r.value = parseFloat(r_rango.value);

        draw();

    });

    //Actualizamos valor de k y k_rango 
    k.addEventListener("input", function(evt){
        
        let val = parseFloat(k.value);
        if(isNaN(val)){
            k.value = 0;
        }
        k_rango.value = k.value;
        
        draw();

    });

    //Actualizamos valor de k_rango y k
    k_rango.addEventListener("input", function(evt){

        k.value = parseFloat(k_rango.value);

        draw();

    });

    //Actualizamos valor de vueltas y vueltas_rango
    vueltas.addEventListener("input", function(evt){
        
        let val = parseFloat(vueltas.value);
        if(isNaN(val)){
            vueltas.value = 0;
        }
        vueltas_rango.value = vueltas.value;
        
        draw();

    });

    //Actualizamos valor de vueltas_rango y vueltas
    vueltas_rango.addEventListener("input", function(evt){

        vueltas.value = parseFloat(vueltas_rango.value);

        draw();

    });

    // Funcion para dibujar el epicicloide 
    function draw(){

        let radio = parseFloat(r.value);
        let k_cons = parseFloat(k.value);
        let vuel = parseFloat(vueltas.value);

        //Cada vez que se dibuje, se limpia el canvas
        context.clearRect(0,0,canvas.width ,canvas.height);

        context.lineWidth=3;

        //Dibujamos el plano
        context.beginPath();
        context.strokeStyle = 'green';
        context.setLineDash([10, 10]);
        context.moveTo(xcentro, 0);  // Eje vertical
        context.lineTo(xcentro, canvas.height);
        context.moveTo(0, ycentro);  // Eje horizontal
        context.lineTo(canvas.width, ycentro);
        context.stroke();

        //Dibujamos el epicicloide
        context.beginPath();
        context.setLineDash([]);
        
        context.strokeStyle = 'blue';
        context.lineJoin='bevel';

        /**
        * x(theta) = r(k+1) cos(theta) - r cos((k+1) theta)
        * 
        * y(theta) = r(k+1) sen(theta) - r sin((k+1) theta) 
        */

        // Establecemos el valor de theta
        let maxTheta = 2 * Math.PI * vuel;

        // Establecemos el incremento del for
        let incremento = 0.01;
        for (let t = 0; t <= maxTheta; t += incremento) {
            let x = (radio * (k_cons + 1) * Math.cos(t)) - (radio * Math.cos((k_cons + 1) * t));
            let y = (radio * (k_cons + 1) * Math.sin(t)) - (radio * Math.sin((k_cons + 1) * t));
                context.lineTo(xcentro + x, ycentro + y);
        }
        context.stroke();

    }

    draw();

});