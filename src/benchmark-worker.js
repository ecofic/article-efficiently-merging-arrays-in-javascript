// The arrays are globally defined because they're shared.
// This is typically not recommended.
let GLOBAL_ARRAY_1 = null;
let GLOBAL_ARRAY_2 = null;

onmessage = (e) => {
    let array1 = null;
    let array2 = null;
    
    let iteration = null;
    let concatCompleted = false;
    let pushCompleted = false;
    let spreadCompleted = false;

    /**
     * Initializes an array.
     */
     function initializeArray(arrayLength, arrayType) {
        const results = [];
        if (arrayType === 'values') {
            for (let i=0; i<arrayLength; i++) {
                const value = (i+1);
                results.push(value);
            }
        } else if (arrayType === 'objects') {
            for (let i=0; i<arrayLength; i++) {
                const result = { p1:(i+1), p2:`Number ${(i+1)}` };          // A generate object with two properties.
                results.push(result);
            }
        }
        return results;
    }

    /**
     * Runs a test iteration.
     * NOTE: This function assumes array1 and array2 have been initialized.
     */
    function runIteration(options) {
        iteration = { number: options.number };
        array1 = GLOBAL_ARRAY_1;
        array2 = GLOBAL_ARRAY_2;

        executeConcat(options.useConcat);
        executePush(options.usePush);
        executeSpread(options.useSpread);
    }

    /**
     * Merges two arrays using the built-in concat method in JavaScript.
     */
    function executeConcat(shouldRun) {
        concatCompleted = false;
        if (shouldRun) {
            try {
                const startTime = performance.now();
                let result = array1.concat(array2); 
                iteration.concatRuntime = performance.now() - startTime;
                result = null;    
            } catch (err) {
                iteration.concatRuntime = 'N/A';
            }
        }
        concatCompleted = true;

        assertCompleteIteration();
    }

    /**
     * Merges two array using the Array's push method in JavaScript.
     */
    function executePush(shouldRun) {
        pushCompleted = false;
        if (shouldRun) {
            try {
                let result = array1.slice();

                const startTime = performance.now();
                for (let i=0; i<array2.length; i++) {
                    result.push(array2[i]);                    
                }
                iteration.pushRuntime = performance.now() - startTime;

                result = null;    
            } catch (err) {
                iteration.pushRuntime = 'N/A';
            }
        }
        pushCompleted = true;

        assertCompleteIteration();
    }

    /**
     * Merges two arrays using the spread operator.
     */
    function executeSpread(shouldRun) {
        spreadCompleted = false;
        if (shouldRun) {
            try {
                let result = array1.slice();

                const startTime = performance.now();
                result.push(...array2);
                iteration.spreadRuntime = performance.now() - startTime;

                result = null;
            } catch (err) {
                iteration.spreadRuntime = 'N/A';
            }
        }
        spreadCompleted = true;

        assertCompleteIteration();
    }

    /**
     * Tests to see if the current iteration has completed.
     */
    function assertCompleteIteration() {
        const isComplete = concatCompleted && pushCompleted && spreadCompleted;
        if (isComplete) {
            const response = { command:'test-iteration-completed', iteration:iteration };
            postMessage(response);
        }
    }

    // React to the command sent to the user.
    if (e.data.command === 'initialize-arrays') {
        GLOBAL_ARRAY_1 = initializeArray(e.data.array1Length, e.data.array1Type);
        GLOBAL_ARRAY_2 = initializeArray(e.data.array2Length, e.data.array2Type);

        const response = { command:'initialize-arrays-completed' };
        postMessage(response);
    } else if (e.data.command === 'run-iteration') {
        runIteration(e.data);
    }
};