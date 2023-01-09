// format of pairing file:
// key = "pairing"
// value = [len, beamsize, t1, t2, name, seq, lc, lv, PRF, hit_lc, _, _, PRF, hit_lv, _, _]
dataArray=[
{"seq":"AUUAAAGGUUUAUACCUUCCCAGGUAACAAACCAACCAACUUUCGAUCUCUUGUAGAUCUGUUCUCUAAACGAACUUUAAAAUCUGUGUGGCUGUCACUCGGCUGCAUGCUUAGUGCACUCACGCAGUAUAAUUAAUAACUAA-U--UACUGUCGUUGACAGGACACGAGUAACUCGUCUAUCUUCUGCAGGCUGCUUACGGUUUCGUCCGUGUUGCAGCCGAUCAUCAGCACAUCUAGGUUUCGUCCGGGUGUGACCGAAAGGUAAGAUGGAGAGCCUUGUCCCUGGUUUCAACGAGAA", "struc":"......(((((.(((((....)))))..)))))...........(((((.....)))))........................((((((((.((.((((.(((.....))).)))))).))))))))..((((((.....)))-)--)).(.(((((((((((..(((((...(((.((((((((.....((((((.(((((......)))))..)))))).........(((((((.((......)))))))))(((....)))))))))))))).))))).))))...))))))).).","name":"Sequence0"}, {"seq":"AUAUUAGGUUUUUACCUACCCAGGAA--AAGCCAACCAACC-UCGAUCUCUUGUAGAUCUGUUCUCUAAACGAACUUUAAAAUCUGUGUAGCUGUCGCUCGGCUGCAUGCCUAGUGCACCUACGCAGUAUAAACAAUAAUAAA-UUUUACUGUCGUUGACAAGAAACGAGUAACUCGUCCCUCUUCUGCAGACUGCUUACGGUUUCGUCCGUGUUGCAGUCGAUCAUCAGCAUACCUAGGUUUCGUCCGGGUGUGACCGAAAGGUAAGAUGGAGAGCCUUGUUCUUGGUGUCAACGAGAA", "struc":"....(((((....)))))........--.............-..(((((.....))))).((((.......))))........((((((((.((.((((.(((.....))).)))))).))))))))................-........((((((((((((.(((((...(((.(((.((((.....((((((.(((((......)))))..)))))).........(((((((.((......)))))))))(((....))))))).)))))).)))))))))...))))))))...","name":"Sequence1"}, {"seq":"AUAUUAGGUUUUUACCUACCCAGGAA--AAGCCAACCAAUC-UCGAUCUCUUGUAGAUCUGUUCUCUAAACGAACUUUAAAAUCUGUGUAGCUGUCGCUCGGCUGCAUGCCUAGUGCACUUACGCAGUAUAAAUAUUAAUAACUU--UACUGUCGCUGACUGGAUACGAGUAACUCGUCCUUCUUCUGCAGACUGCUUACGGUUUCGUCCGUGUUGCAGUCGAUCAUCAGCAUACCUAGGUUUCGUCCGGGUGUGACCGAAAGGUAAGAUGGAGAGCCUUGCUCUUGGUGUCAGCGAGAAA", "struc":"......(((((((.(((....)))))--)))))........-..(((((.....)))))........................((((((((.((.((((.(((.....))).)))))).))))))))..................--.......((((((.(((..((((...(((.(((.(((((((..((((((.(((((......)))))..))))))......)))(((((((.((......)))))))))(((....))))))).)))))).)))).)))....))))))......","name":"Sequence2"}];

function getNode(n, v) {
    //console.log(v);
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v)
    n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
    //console.log(n);
  return n
}

//EVAN YANG import from text file and create DataArray section
var modifiedDataArray=[];
var obj;

var twentyFiveArray=[];


function loadPreset(){
    $('.selectpicker').selectpicker('val',[1,16,21]);
    fetch('https://raw.githubusercontent.com/LinearFold/LinearTurboFold/main/sars-cov-2_results/sars-cov-2_and_sars-related_25_genomes_msa_structures.txt')
        .then(response => response.text())
        //.then(data => obj=data)
        //.then(() => console.log(obj))
        .then(data=>{
            // Do something with your data
            testArray=data.split('\n');
            var holdingDict={};
            //console.log("before ", dataArray.length);
            for(count in testArray){
                //console.log(testArray[count]);
                //evan=3;
                if(count%3==0){
                    holdingDict={};
                    holdingDict['seq']=testArray[parseInt(count)+1];
                    holdingDict['struc']=testArray[parseInt(count)+2];
                    holdingDict['name']=testArray[count];
                    //console.log(holdingDict);
                    twentyFiveArray.push(holdingDict);
                    //dataArray[evan]=holdingDict;
                    //evan=evan+1;
                }
            }
            //console.log("after", dataArray.length);
            //console.log(dataArray);
            //console.log('hey');
            console.log(62, twentyFiveArray);
            applyRange25();
        });

}

//console.log('hey');
for(label in dataArray){
    holderDict={};
    holderDict['seq']=dataArray[label].seq.split('');
    holderDict['struc']=dataArray[label].struc.split('');
    modifiedDataArray.push(holderDict);
};
//end dataArray creation section

//open outfiles.txt and convert it a dictionairy


function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
};


modifiedDataArray= [
    {'seq':dataArray[0].seq.split(''),'struc':dataArray[0].struc.split('')},
    {'seq':dataArray[1].seq.split(''),'struc':dataArray[1].struc.split('')},
    {'seq':dataArray[2].seq.split(''),'struc':dataArray[2].struc.split('')}
]


//console.log(modifiedDataArray);
//creates pairing array with dictionairy
pairingArray=[];
for(sCounter in modifiedDataArray){
    holderArray=[];
    d=0;
    while(d<=modifiedDataArray[sCounter].struc.length){
        holderArray.push('0');
        d+=1;
    }
    //
    holder=[];
    for(sCount in modifiedDataArray[sCounter].struc){ //sCount is the index
        if(modifiedDataArray[sCounter].struc[sCount]=='('){
            holder.push(parseInt(sCount)+1);
        }
        if(modifiedDataArray[sCounter].struc[sCount]==')'){
            match=holder.pop();
            pair=[match,parseInt(sCount)+1];
            holderArray[match]=parseInt(sCount)+1;
            holderArray[parseInt(sCount)+1]=match;
        }

    }

    //
    pairingArray.push({pairs:holderArray});
}
//console.log(pairingArray[1].pairs[5]);




function resetFunction(){
    $("#res-show").html(groupRes(dataArray,100));
    document.getElementById("typePos1").value= null;
    document.getElementById('typePos2').value=null;
    $("#seqSelect").selectpicker('deselectAll');
}

function newShrink(start,end,whichSeq){
    leftCut=start;
    rightCut=end;
    leftCounter=start+1;
    leftCut=start+1;
    firstTime=true;
    while(leftCounter<=end){
        if(firstTime && modifiedDataArray[whichSeq].struc[leftCounter-1]=='('){
            if(start <= parseInt(pairingArray[whichSeq].pairs[leftCounter]) && parseInt(pairingArray[whichSeq].pairs[leftCounter]) <= end){
                leftCut=leftCounter;
                rightCut=parseInt(pairingArray[whichSeq].pairs[leftCut]);
                firstTime=false;
                console.log('hey',leftCut, rightCut);
            }
        }


        if(modifiedDataArray[whichSeq].struc[leftCounter-1]=='('){
            //console.log(leftCounter);
            if(start <= parseInt(pairingArray[whichSeq].pairs[leftCounter]) && parseInt(pairingArray[whichSeq].pairs[leftCounter]) <= end){
                //console.log(parseInt(leftCounter)-1,pairingArray[whichSeq].pairs[leftCounter-1]);
                //not getting to below
                //console.log(rightCut);
                if(parseInt(pairingArray[whichSeq].pairs[leftCounter])>rightCut){
                    console.log('true');
                    rightCut=parseInt(pairingArray[whichSeq].pairs[leftCounter]);
                }
            }
        }

        //new stuff added that might mess it up
        // if ) and unpaired, then you stop at that place????
        if(modifiedDataArray[whichSeq].struc[leftCounter-1]==')'){
            if(pairingArray[whichSeq].pairs[leftCounter]<=start){
                rightCut=leftCounter;
                console.log("right cut is permanently ", rightCut);
            }

        }
        //end new stuff
        leftCounter+=1;
    }
    return [leftCut,rightCut];
}
function shrink25Best(start22,end22, whatSeq){
    var sequences=$('#seqSelect').val();
    if(sequences==null){
        returnThis22=shrink(start22,end22,whatSeq);
        //console.log("hey");
        return returnThis22;
    }
    else{
        leftIndex=[];
        toReplace=[];
        strucArray=twentyFiveArray[whatSeq].struc.split("");
        //console.log(strucArray);
        shrinkCounter=start22-1;

        while(shrinkCounter<end22){
            //console.log(shrinkCounter, strucArray[shrinkCounter]);//out of sync
            if(strucArray[(shrinkCounter/*+1*/)]=="("){
                leftIndex.push(shrinkCounter);
            }

            if(strucArray[(shrinkCounter/*+1*/)]==")"){
                if(leftIndex.length==0){
                    toReplace.push(shrinkCounter);
                }
                else{
                    leftIndex.pop();
                }
            }
            shrinkCounter+=1;
            //console.log(shrinkCounter, end22);
        }
        finalReplacements=toReplace.concat(leftIndex);
        var shrCounter=0
        while(shrCounter<finalReplacements.length){
            strucArray[finalReplacements[shrCounter]]=".";
            shrCounter+=1;
        }
        returning="";
        tempShrinkArray=strucArray.slice(start22-1,end22);
        //console.log(finalReplacements);
        for(shrThing in tempShrinkArray){
            returning=returning+tempShrinkArray[shrThing];

        }
        //console.log(returning);

        return returning;//returns a modified string;
    }
}
function shrink25(start,end,whichSeq){
    var sequences=$('#seqSelect').val();
    pairs=createPairs();
    if(sequences==null){
        returnThis=shrink(start,end,whichSeq);
        //console.log("hey");
        return returnThis;
    }
    else{
        leftCounter= start;
        leftCut=start;
        rightCut=end;
        //replaceThese=[];
        holder=twentyFiveArray[whichSeq].seq.split("");//holder[0]=index of 1
        while(leftCounter<=end){
            //console.log(leftCounter, pairs[whichSeq][leftCounter]);
            if(holder[(leftCounter-1)]==")"){
                if(pairs[whichSeq][leftCounter]<start){
                    //console.log(leftCounter,"paired with", pairs[whichSeq][leftCounter] );
                    leftCut=leftCounter;
                    //replaceThese.push()
                }
            }
            leftCounter+=1;
        }
        rightCounter=end;
        while(rightCounter>=start){
            if(holder[(rightCounter-1)=='(']){
                if(pairs[whichSeq][rightCounter]>end){
                    rightCut=rightCounter;
                }
            }
            rightCounter=rightCounter-1;
        }
        return [leftCut,rightCut];
    }
}


function shrink(start,end,whichSeq){
    var sequences= $('#seqSelect').val();
    //pairs=createPairs();
    if(sequences==null){
        //use pairing array to determine pairs
        tempArray=pairingArray[whichSeq].pairs;
        //left side
        leftCounter=start+1;
        leftCut=start+1; //the number to make the leftCut on the sequence
        useRightCounter=true;
        while(leftCounter<=end){
            if(modifiedDataArray[whichSeq].struc[leftCounter-1]==')'){
                if(tempArray[leftCounter]<start){// if its pair is out of index
                    leftCut=leftCounter+1;
                }
            }
        leftCounter+=1;
        }
        //right side
        rightCounter=end;
        rightCut=end;
        while(rightCounter>=start){
            if(modifiedDataArray[whichSeq].struc[rightCounter-1]=='('){
                if(tempArray[rightCounter]>end){
                    rightCut=rightCounter-1;
                }
            }
            rightCounter=rightCounter-1;
        }
        return [leftCut,rightCut];
    }
}

function createPairs(){
    //create a data array of pairs for all twenty five sequences
    twentyFiveTruePairs=[];
    for(num in twentyFiveArray){
        strucArray=twentyFiveArray[num].struc.split('');
        holder=[];
        twentyFivePairArray=[];
        for(sCount in strucArray){ //sCount is the index
            if(strucArray[sCount]=='('){
                holder.push(parseInt(sCount)+1);
            }
            if(strucArray[sCount]==')'){
                match= holder.pop()
                pair=[match,parseInt(sCount)+1];
                twentyFivePairArray.push(pair);
            }
        }
        //console.log(twentyFivePairArray);
        pushArray=Array(strucArray.length+1).fill(0);
        for(item in twentyFivePairArray){
            //console.log(twentyFivePairArray[item]);//returns array of two
            pushArray[twentyFivePairArray[item][0]]=twentyFivePairArray[item][1];
            pushArray[twentyFivePairArray[item][1]]=twentyFivePairArray[item][0];

        }
        twentyFiveTruePairs.push(pushArray);
    }
    return twentyFiveTruePairs;
    //creates pairingArray for each sequence

}

function updateSequences(){
    var sequences= $('#seqSelect').val(); //returns an Array of value
    returnString='';
    strucArray=[];
    seqArray=[];
    firstLength=twentyFiveArray[sequences[0]].seq.length;
    pairs=createPairs();
    tWidth=90;
    posStart=0;
    posEnd=tWidth;

    while(posStart<firstLength){
        if(posEnd>firstLength){
            posEnd=firstLength;
        }

        //sequences part
        for(num in sequences){
            counter=posStart;
            selectThis=document.getElementById("seqSelect");
            seqArray=twentyFiveArray[sequences[num]].seq.split('');
            //returnString+=twentyFiveArray[num].name.fontcolor("blue")+"<br>"+(posStart+1).toString().padStart(6,',')+ ' ';
            returnString+=selectThis.options[sequences[num]].innerHTML.padStart(14,",").fontcolor("blue")+(posStart+1).toString().padStart(6,',')+ ' ';
            //console.log(selectThis.options[0].innerHTML);
            while(counter<posEnd){
                id= "Seq" + sequences[num]+'_'+(counter+1)+'_'+pairs[sequences[num]][counter+1];
                returnString+='<span class= "test" id="'+id+'">'+seqArray[counter]+'</span>';
                counter=counter+1;
            }
            returnString+= ' '+posEnd;
            returnString+='<br>';

            strucArray=twentyFiveArray[sequences[num]].struc.split('');
            counter=posStart;
            returnString+=selectThis.options[sequences[num]].innerHTML.padStart(14,",").fontcolor("blue") +(posStart+1).toString().padStart(6,',') + ' ';
            while(counter<posEnd){
                id= "Stru" + sequences[num]+'_'+(counter+1)+'_'+pairs[sequences[num]][counter+1];
                returnString+='<span class= "test" id="'+id+'">'+strucArray[counter]+'</span>';
                counter+=1;
            }
            returnString+= ' '+ posEnd;
            returnString+='<br>';
        }
        returnString+='<br>';
        posStart=posEnd;
        posEnd=posEnd+tWidth;
    }
    returnString = returnString.replace(/,/g,'&nbsp;');
    $("#res-show").html(returnString);
}

function applyRange25(){
    maxAlignedLen = twentyFiveArray[0].seq.length;
    var sequences= $('#seqSelect').val();
    //console.log(sequences, 'in apply');
    pairs=createPairs();
    //console.log(sequences);
    if(sequences==null){
        // applyRangeBest();
        $('#seqSelect').selectpicker("selectAll");
        $('#seqSelect').selectpicker('refresh');
        sequences=$('#seqSelect').val();
    }

    selectThis=document.getElementById("seqSelect");
    var oldStart=parseInt($('#typePos1').val());
    var oldEnd=parseInt($('#typePos2').val());
    rangeNotice = '';
    if (isNaN(oldStart) || oldStart < 1) {
        oldStart = 1;
        rangeNotice += "Invalid Start index, reset to "+oldStart+'. '  ;
    }
    else if (oldStart > maxAlignedLen) {
        oldStart = Math.max(1, maxAlignedLen-100);
        rangeNotice += "Start index larger than aligned length, reset to "+oldStart+'. '  ;
    }
    if (isNaN(oldEnd) || oldEnd < 0 || oldEnd < oldStart) {
        oldEnd = maxAlignedLen;
        rangeNotice += "Invalid End index, reset to " + Math.min(oldStart+100, maxAlignedLen);
    }
    if (oldEnd > maxAlignedLen) {
        oldEnd = maxAlignedLen;
        rangeNotice += "End Index larger than aligned length, reset to " + maxAlignedLen;
    }
    if (oldEnd - oldStart > 1000) {
        oldEnd = oldStart+1000-1;
        rangeNotice += "Range more than 1000, reset to "+oldStart+' ~ '+oldEnd;
    }
    $('#rangeNotice').text(rangeNotice);
    embedString='';
    //console.log
    counter=oldStart;
    textWidth=80;
    //console.log(1003, sequences);
    //console.log(selectThis.options[])
    while(counter<oldEnd){
        for(item in sequences){
            //console.log(item);
            //console.log(sequences[item]);
            //console.log(selectThis.options[sequences[item]]);
            //console.log(selectThis.options[17]);
            seqName=selectThis.options[parseInt(sequences[item])].innerHTML;
            console.log(seqName)
            if(seqName.length>14){
                seqName=seqName.substring(0,14);
                seqName+='...';
            }
            //console.log(seqName)
            //embedString+="<br>"+selectThis.options[sequences[item]].innerHTML.padStart(14,",").fontcolor("blue")+counter.toString().padStart(6,',')+ ' ' +' ';
            embedString+="<br>"+seqName.padStart(17,",").fontcolor("blue")+counter.toString().padStart(6,',')+ ' ' +' '; //error line
            tempSeq=twentyFiveArray[sequences[item]].seq.split('');
            tempStruc=twentyFiveArray[sequences[item]].struc.split('');

            tempCounter=counter;
            stopPoint=counter+textWidth;
            if(stopPoint>oldEnd){
                stopPoint=oldEnd+1;
            }
            while(tempCounter<stopPoint){
                id= "Seq" + sequences[item]+'_'+(tempCounter)+'_'+pairs[sequences[item]][tempCounter];
                embedString+='<span class="test" id="'+ id+'">' + tempSeq[tempCounter-1] +'</span>'
                tempCounter+=1;
            }

            //embedString+=' '+(stopPoint-1)+"<br>" +selectThis.options[sequences[item]].innerHTML.padStart(14,",").fontcolor("blue")+counter.toString().padStart(6,',')+ ' ' +' ';
            //embedString+=' '+(stopPoint-1)+"<br>" +'Structure'.padEnd(17,",")+counter.toString().padStart(6,',')+ ' ' +' ';
            embedString+=' '+(stopPoint-1)+"<br>" +counter.toString().padStart(23,',')+ ' ' +' ';
            tempCounter=counter;
            while(tempCounter<stopPoint){
                id= "Stru" + sequences[item]+'_'+(tempCounter)+'_'+pairs[sequences[item]][tempCounter];
                //id= "Stru" + (parseInt(sequences[item])+1)+'('+twentyFiveArray[sequences[item]].name+')'+'_'+(tempCounter)+'_'+pairs[sequences[item]][tempCounter];
                embedString+='<span class="test" id="'+id+'">' + tempStruc[tempCounter-1] +'</span>'
                tempCounter+=1;
            }
            embedString+=' '+(stopPoint-1);
        }
        embedString+='<br>';
        counter+=textWidth;


    }
    embedString+="<br>";
    //insertForna part
    //for(insertThis in sequences){
    //    embedString+=selectThis.options[parseInt(sequences[insertThis])].innerHTML+ "&nbsp;";
    //}
    embedString+='<div class="grid">';
    gridCol=3;
    for(item_ in sequences){
        seqFornaNew=twentyFiveArray[sequences[item_]].seq.substring(oldStart-1,oldEnd);
        strucFornaNew=shrink25Best(oldStart,oldEnd,sequences[item_]);
        seqFornaNew=seqFornaNew.replace(/-/g,'');
        strucFornaNew=strucFornaNew.replace(/-/g,'');
        strucFornaNew=strucFornaNew.replaceAll('<',".").replaceAll(">",".");
        addition='';
        if (item_ > 0 && item_ % gridCol == 0) {addition += '<br>'};
        addition+='<div class="col-1-'+gridCol+'">';
        addition+=twentyFiveArray[sequences[item_]].name+ "<br>";
        addition+='<iframe id="Evanforna'+item+'" src="http://nibiru.tbi.univie.ac.at/forna/forna.html?id=fasta&amp;file=>header%5Cn'+seqFornaNew+'%5Cn'+strucFornaNew+'" width="100%" height="500" frameborder="0"></iframe>';
        addition+="</div>";
        embedString+= addition;
    }
    embedString+="</div>";
    embedString = embedString.replace(/,/g,'&nbsp;');
    $("#res-show").html(embedString);

}

function applyRangeBest(){
    var oldStart=parseInt($('#typePos1').val());
    var oldEnd=parseInt($('#typePos2').val());
    addThis=0;
    a=0;
    //counts dashes in all 3 from 0 to start
    while(a<oldStart){
        if(modifiedDataArray[0].struc[a]=='-' && modifiedDataArray[1].struc[a]=='-' && modifiedDataArray[2].struc[a]=='-'){
            addThis+=1;
        }
        a+=1;
    }
    //counts dashes between start and end
    addThisToEnd=0;
    b=oldStart;
    while(b<oldEnd){
        if(modifiedDataArray[0].struc[b]=='-' && modifiedDataArray[1].struc[b]=='-' && modifiedDataArray[2].struc[b]=='-'){
            addThisToEnd+=1;
        }
        b+=1
    }
    //identifies newStart and newEnd
    newStart= oldStart +addThis-1;
    newEnd=oldEnd+addThis+addThisToEnd;
    //hides display
    //hideThis=document.getElementById('res-show').style.display='none';
    //creates newString, formatted correctly searchThis
    newString='';
    counting=newStart;
    textWidth=90;
    endPoint=newStart+textWidth;
    while(counting<newEnd){
        if(endPoint>newEnd){
            endPoint=newEnd;
        }
        for(dictCount in modifiedDataArray){
            holdingSeq= modifiedDataArray[dictCount].seq.slice(counting,endPoint);
            holdingStruc=modifiedDataArray[dictCount].struc.slice(counting,endPoint);

            //creates seq span elements
            newString+= "Seq "+ dictCount + " " +(counting+1).toString().padStart(5,',')+ ' ';
            nucleoCounter=0;
            while(nucleoCounter < holdingSeq.length){
                newString+= '<span class= "test" id ='+'Seq'+dictCount+'_'+(counting+nucleoCounter+1)+'_'+pairingArray[dictCount].pairs[(counting+nucleoCounter+1)]+'>' + holdingSeq[nucleoCounter] + '</span>';
                nucleoCounter+=1;
            }
            newString+= '&nbsp;' + endPoint;
            newString+='<br>'

            //creates struc span elements
            newString+="Stru "+dictCount+ " "+ (counting+1).toString().padStart(4,',')+ ' ';
            sequenceCounter=0;
            while(sequenceCounter < holdingStruc.length){
                newString+='<span class= "test" id ='+'Stru'+dictCount+'_'+(counting+sequenceCounter+1)+'_'+pairingArray[dictCount].pairs[(counting+sequenceCounter+1)]+'>' + holdingStruc[sequenceCounter] + '</span>';
                sequenceCounter+=1;
            }
            newString+= '&nbsp;' + endPoint;
            newString+='<br>'
        }
        newString+='<br>'
        counting=endPoint;
        endPoint+=textWidth;
    }
    newString = newString.replace(/,/g,'&nbsp;');
    //insert embedded elements for each 3
    //get seq and struc for seq0- easiest way would be to split the string at indexes, newStart and newEnd
    for(f in dataArray){

        //shrink forna
        shrinkArray=shrink25(newStart,newEnd,f);



        seqForna=dataArray[f].seq.substring(shrinkArray[0]-1,shrinkArray[1]);
        strucForna=dataArray[f].struc.substring(shrinkArray[0]-1,shrinkArray[1]);

        seqForna=seqForna.replace(/-/g,'');
        strucForna=strucForna.replace(/-/g,'');


        newString+="<br>" +dataArray[f].name + '<br>';
        newString+="<br> From "+shrinkArray[0] + ' To '+ shrinkArray[1]+ '<br>';
        newString+="<br>"+seqForna+"<br>";
        newString+="<br>"+strucForna+"<br>";
        addition='<iframe id="Evanforna'+f+'" src="http://nibiru.tbi.univie.ac.at/forna/forna.html?id=fasta&amp;file=>header%5Cn'+seqForna+'%5Cn'+strucForna+'" width="100%" height="500" frameborder="0"></iframe>';
        console.log(addition);
        newString+=addition;
    }
    //end embedded forna elements
    $("#res-show").html(newString);
}




function redisplay(start,end){
    returningString='<p> return this <p>';
}


//important- $("#res-show").html()
//$("#res-show2").html()

function groupRes(myData, textWid){
    finalString=' This is a demonstration sequence <br> <br>';
    lmax=myData[0].seq.length; //works
    lengthCounter=lmax;

    posStart=0;
    posEnd=textWid;

    while(posStart<lengthCounter){
        if(posEnd>lengthCounter){
            posEnd=lengthCounter;
        }
        for(dCount in myData){
            tempSeqArray=myData[dCount].seq.split('');
            tempStrucArray=myData[dCount].struc.split('');

            //pairing section
            holder=[];
            pairArray=[];
            for(sCount in tempStrucArray){ //sCount is the index
                if(tempStrucArray[sCount]=='('){
                    holder.push(parseInt(sCount)+1);
                }
                if(tempStrucArray[sCount]==')'){
                    match= holder.pop()
                    pair=[match,parseInt(sCount)+1];
                    pairArray.push(pair);

                }

            }
            //pairing section ends

            finalString+='Seq ' + dCount + '     ' + (posStart+1).toString().padStart(4,',')+' ';

            holderSeq= tempSeqArray.slice(posStart,posEnd);
            for(nCounter in holderSeq){
                //start of pairing array search
                matched=0;
                finder=parseInt(nCounter)+posStart+1;
                index=pairArray.findIndex(arr =>arr.includes(finder));
                ///console.log(pairArray[index]);
                if(index!=-1){
                    for(pairMatch in pairArray[index]){
                       // console.log(pairMatch);// returns 0 or 1
                        //console.log(pairArray[index][pairMatch]); //returns number at index
                        if(parseInt(pairArray[index][pairMatch]) !=finder){
                            matched=pairArray[index][pairMatch];
                        }
                    }
                }

                //end
                finalString+= '<span class ="test" id=Seq'+dCount+'_'+(parseInt(nCounter)+posStart+1)+'_'+matched +'>' +holderSeq[nCounter]+ '</span>';
            }
            finalString+= " " + posEnd;
            finalString+= '<br>';
            finalString+='Stru ' + dCount + '      '+(posStart+1).toString().padStart(3,',')+ ' ';

            holderStruc=tempStrucArray.slice(posStart,posEnd);
            for(iCounter in holderStruc){
                //start of pairing array search
                sMatched=0;
                finder=parseInt(iCounter)+posStart+1;
                index=pairArray.findIndex(arr =>arr.includes(finder));
                ///console.log(pairArray[index]);
                if(index!=-1){
                    for(pairMatch in pairArray[index]){
                        //console.log(pairMatch);// returns 0 or 1
                        //console.log(pairArray[index][pairMatch]); //returns number at index
                        if(parseInt(pairArray[index][pairMatch]) !=finder){
                            sMatched=pairArray[index][pairMatch];
                        }
                    }
                }

                //end
                finalString+= '<span class ="test" id=Stru'+dCount+'_'+(parseInt(iCounter)+posStart+1)+'_'+sMatched+'>' +holderStruc[iCounter]+ '</span>';
            }
            finalString+= " " + posEnd;
            finalString+= '<br>';
            finalString = finalString.replace(/,/g,'&nbsp;');
        }
        posStart=posEnd;
        posEnd+=textWid;
        finalString+='<br>'
    }




    //console.log(finalString);
    return finalString;
}
//}

function padding_align_seq(lineName, seq, start, end){
    pad_left = (lineName+ start.toString().padStart(5, ' ')+ '     ').replace(/ /g, '&nbsp;');
    pad_right= (end.toString().padStart(7, ' ')+ '     ').replace(/ /g, '&nbsp;');
    return pad_left + seq + pad_right + ' <br>';
}

function linebreak(data, textWid, tup, triple=false){
    var lst = data.split("");
    if (triple) {
        for (var i=0;i<lst.length;i++) {lst[i] = ' '+lst[i]+' ';}
        lst = lst.join("").split("");
        for (var i=0;i<lst.length;i++) {
            if (lst[i] == ' ') { lst[i]='&nbsp;';}
        }

    } else {
        for (var ii=0;ii<tup.length;ii++){
            var i0=tup[ii][0], j0=tup[ii][1];
            for (jj=i0; jj<=j0; jj++){
    	    lst[jj] = '<span style="color:red" class="res">'+lst[jj]+'</span>';
                // lst[jj] = '<span style="color:red">'+lst[jj]+'</span>';
            }
        }
    }


    var t = '', i;
    for (i=0; i<lst.length-textWid; i+=textWid)
        t = t + lst.slice(i,i+textWid).join("") + ' <br>';
    t = t + lst.slice(i).join("");
    //console.log(t);
    return t;
}


//EvanReadResults

$( document ).ready(function() {

    $("#typePos1").val("1");
    $("#typePos2").val("200");
    //loadResults($('#jobname').text());
    loadPreset();
    console.log( "results loaded" );
})


function loadResults(jobname) {
    output_path = '/LTFDir/'+jobname+'/ltf.out';
    // console.log('output location: '+output_path);
    jQuery.get(output_path, function(data){
    //process text file line by line
        var textByLine = data.split("\n")
        //$('#div').html(textByLine);
        var finalArray=[]
        var addDict={}
        for(adCount in textByLine){
           if(adCount%3==0){
               addDict={}
               addDict['seq']=textByLine[parseInt(adCount)+1];
               addDict['struc']= textByLine[parseInt(adCount)+2];
               addDict['name']= textByLine[adCount];
               while (addDict['name'][addDict['name'].length-1] == '_')
               {
                   addDict['name'] = addDict['name'].slice(0,-1);
               }
               while (addDict['name'][0] == '>')
               {
                   addDict['name'] = addDict['name'].slice(1);
               }
               finalArray.push(addDict);
           }
        }
        //processing finalArray- removes undefined values

        for(aNum in finalArray){
            if(finalArray[aNum].seq == undefined){
                finalArray.splice(aNum);
            }
        }

        //read from finalArray and add to html selection
        for(sNum in finalArray){
           //console.log(finalArray[sNum].seq);
           //editing addString
           addString='';
           addValue=parseInt(sNum); //+25 //change this 25;
           //addString+='<option value='+addValue +' data-subtext="'+ finalArray[sNum].name+'">'+'Testing1'+ '</option>';
           addString+='<option value='+addValue +'>'+finalArray[sNum].name+ '</option>';
           //add String below
           $('#seqSelect').append(addString); //prepend function
           //$("#SARS-Cov-1").children().prop('disabled', true);
           //$('#seqSelect').selectpicker('refresh');

        }
        $('#seqSelect').selectpicker("selectAll");
        $('#seqSelect').selectpicker('refresh');
        //add each value to twenty five array
        twentyFiveArray=twentyFiveArray.concat(finalArray);
        console.log('twentyFiveArray', twentyFiveArray);
        applyRange25();


  });
}


var btn = $('#return-to-top');

$(window).scroll(function() {
  if ($(window).scrollTop() > 200) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '200');
});


// $('.selectpicker').selectpicker('val',[1,16,21]);
//window.onload= applyRange25;
