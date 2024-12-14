const buttons = {
    run() {
        //document.getElementById('ans').style.transition = "0.2s";
        //document.getElementById('ans').style.filter = 'blur(0)';

        var str = document.getElementById('ans').value.replaceAll(/[\‘\’\“\”\"\`\']/g, "\'");

        let b = false;
        try {
            output = alasql(str);
            console.log("Output:")
            console.log(output);
            console.log("Expected:")
            console.log(correct);
            b = compare([output, correct]);
        }
        catch {
        }
        let c = b ? '#00A881' : '#E0115F';
        let t = b ? 0 : 1;
        let d = b ? 250 : 150;
        document.getElementById('ans').animate(
            [
                { transform: 'translate3D(0, 0, 0)', color: c },
                { transform: `translate3D(-${t}%, ${3 * (1 - t)}%, 0)` },
                { transform: `translate3D(${t}%, ${3 * (1 - t)}%, 0)`, color: c },
                { transform: 'translate3D(0, 0, 0)', color: '#1a1a1b' }
            ], {
            duration: d,
            iterations: 2
        }
        );

        if (b) {
            document.getElementById('qst').textContent = "Correct!";
        }

        hideSchema(schema);
    },
    next() {
        //document.getElementById('ans').style.transition = "0s";
        //document.getElementById('ans').style.filter = 'blur(10px)';

        createQuestion();
        //document.getElementById('ans').textContent = correct.length;
    },
    schema() {
        let schema = document.getElementById('schema');
        if (schema.style.pointerEvents != 'all') {
            showSchema(schema);
        } else {
            hideSchema(schema);
        }

    }
};