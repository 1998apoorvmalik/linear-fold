$tooltipbox = $(".tooltipbox");
/*
  $(' .tooltips').hover(function() {
    $tooltipbox.addClass('active');
    console.log('hover');
    $tooltipbox.html($(this).attr('id'));
  }, function() {
    $tooltipbox.removeClass('active');
  });
*/

/*
var arcs = document.getElementsByClassName('tooltips');

// this handler will be executed every time the cursor is moved over a different list item
arcs.addEventListener("mouseover", function( event ) {   
  // highlight the mouseover target
  event.target.style.color = "orange";
  $tooltipbox.addClass('active');
  console.log('hover');
  $tooltipbox.html(arcs.id);
  }, 
  function() {
  $tooltipbox.removeClass('active');
  });
*/

console.log('in tooltips js');

$('svg').on('mouseover', '.tooltips-arcs', function(){
    $tooltipbox.addClass('active');
    console.log('arc hover '+$(this).attr('id'));
    $tooltipbox.html($(this).attr('id'));
  //}, function() {
  //  $tooltipbox.removeClass('active');
  });
$('svg').on('mouseleave', '.tooltips-arcs', function(){
    $tooltipbox.removeClass('active');
  });


$(document).on('mousemove', function(e){  
  $tooltipbox.css({
    left:  e.pageX,
    top:   e.pageY - 70
  });
  
});

// Event binding on dynamically created elements?
// As of jQuery 1.7 you should use jQuery.fn.on with the selector parameter filled:
// $(staticAncestors).on(eventName, dynamicChild, function() {});

$('#svg_block').on('mouseover', '.tooltips-arcs', function(){
    $tooltipbox.addClass('active');
    console.log('arc hover '+$(this).attr('id'));
    $tooltipbox.html($(this).attr('id').split(', #')[0]);
  });
$('#svg_block').on('mouseleave', '.tooltips-arcs', function(){
    $tooltipbox.removeClass('active');
  });







//more changes from Evan

function highlightOn25(e,classStr){
  var sequences= $('#lambdaSelect').val();
  id_=$(e.target).attr('id');
  if(sequences==null){
    highlight_on_for_pair(e,'tooltipbox tooltipbox-sm tooltipbox-red');
  }
  else{
    slashIndex=id_.indexOf('_');
    seqID=id_.substring(0,slashIndex); //works
    apoIndex=id_.lastIndexOf('_');
    i=id_.substring(slashIndex+1,apoIndex);
    j=id_.substring(apoIndex+1);
    if(j==0){
      for(item in sequences){
        seqHolder="#Seq"+sequences[item]+"_"+i+'_'+j;
        strucHolder="#Stru"+sequences[item]+"_"+i+"_"+j;
        seqElement=$(seqHolder);
        strucElement=$(strucHolder);
        seqElement.addClass('myhover');
        strucElement.addClass('myhover');
      }
    }
    else{
      for(item in sequences){
       // console.log(sequences[item], "25hey");
        seqHold="#Seq"+sequences[item]+"_"+i+'_'+j;
        strucHold="#Stru"+sequences[item]+"_"+i+"_"+j;
        seqPairHold="#Seq"+sequences[item]+"_"+j+'_'+i;
        strucPairHold="#Stru"+sequences[item]+"_"+j+"_"+i;

        seqElem=$(seqHold);
        strucElem=$(strucHold);
        seqPairElem=$(seqPairHold);
        strucPairElem=$(strucPairHold);

        seqElem.addClass('myhover');
        strucElem.addClass('myhover');
        seqPairElem.addClass('myhover');
        strucPairElem.addClass('myhover');
      }

    }

  }
}

function highlightOff25(e){
  var sequences= $('#lambdaSelect').val();
  if(sequences==null){
    highlight_off_for_pair(e);
  }
  else{
    slashIndex=id_.indexOf('_');
    seqID=id_.substring(0,slashIndex); //works
    apoIndex=id_.lastIndexOf('_');
    i=id_.substring(slashIndex+1,apoIndex);
    j=id_.substring(apoIndex+1);
    if(j==0){
      for(item in sequences){
        seqHolder="#Seq"+sequences[item]+"_"+i+'_'+j;
        strucHolder="#Stru"+sequences[item]+"_"+i+"_"+j;
        seqElement=$(seqHolder);
        strucElement=$(strucHolder);
        seqElement.removeClass('myhover');
        strucElement.removeClass('myhover');
      }
    }
    else{
      for(item in sequences){
       // console.log(sequences[item], "25hey");
        seqHold="#Seq"+sequences[item]+"_"+i+'_'+j;
        strucHold="#Stru"+sequences[item]+"_"+i+"_"+j;
        seqPairHold="#Seq"+sequences[item]+"_"+j+'_'+i;
        strucPairHold="#Stru"+sequences[item]+"_"+j+"_"+i;

        seqElem=$(seqHold);
        strucElem=$(strucHold);
        seqPairElem=$(seqPairHold);
        strucPairElem=$(strucPairHold);

        seqElem.removeClass('myhover');
        strucElem.removeClass('myhover');
        seqPairElem.removeClass('myhover');
        strucPairElem.removeClass('myhover');
      }

    }


  }
}


function highlight_on_for_pair(e, classStr){
    id_=$(e.target).attr('id');
    //console.log(id_);
    //get sequence id,i and j, from id_
    slashIndex=id_.indexOf('_');
    seqID=id_.substring(0,slashIndex); //works
    apoIndex=id_.lastIndexOf('_');
    i=id_.substring(slashIndex+1,apoIndex);
    j=id_.substring(apoIndex+1);
    

    //construct 6 elements from the above information
    //sequence 0, i, j/ structure 0, i, j/ sequence 0 j, i/ structure 0, j i etc...
    //sequence 1, i, j/ structure 1, i, j/ sequence 1 j, i/ structure 1, j i etc...
    //sequence 2, i, j/ structure 2, i, j/ sequence 2 j, i/ structure 2, j i etc...
    //if J is 0, then only 6 are constructed, and if j is not 0, then 12 are constructed
    if(j==0){
      counter=0;
      while(counter<3){
        seqHolder="#Seq"+counter+"_"+i+'_'+j;
        strucHolder="#Stru"+counter+"_"+i+"_"+j;
        seqElement=$(seqHolder);
        //console.log(seqElement);
        strucElement=$(strucHolder);
        seqElement.addClass('myhover');
        strucElement.addClass('myhover');
        counter= counter+1;
      }
    }
    else{
      
      count=0;
      while(count<3){
        seqHold="#Seq"+count+"_"+i+'_'+j;
        strucHold="#Stru"+count+"_"+i+"_"+j;
        seqPairHold="#Seq"+count+"_"+j+'_'+i;
        strucPairHold="#Stru"+count+"_"+j+"_"+i;

        seqElem=$(seqHold);
        strucElem=$(strucHold);
        seqPairElem=$(seqPairHold);
        strucPairElem=$(strucPairHold);

        seqElem.addClass('myhover');
        strucElem.addClass('myhover');
        seqPairElem.addClass('myhover');
        strucPairElem.addClass('myhover');
        count=count+1;
      }
      /*
      var sequences= $('#lambdaSelect').val();
      for(number in sequences){
        seqHold="#Seq"+number+"_"+i+'_'+j;
        strucHold="#Stru"+number+"_"+i+"_"+j;
        seqPairHold="#Seq"+number+"_"+j+'_'+i;
        strucPairHold="#Stru"+numbert+"_"+j+"_"+i;

        seqElem=$(seqHold);
        strucElem=$(strucHold);
        seqPairElem=$(seqPairHold);
        strucPairElem=$(strucPairHold);

        seqElem.addClass('myhover');
        strucElem.addClass('myhover');
        seqPairElem.addClass('myhover');
        strucPairElem.addClass('myhover');
      }
      */
    }
    //add class my hover to each ID
    
   

  
}

function highlight_off_for_pair(e, classStr){

  // find 6 or 12 elements and remove my hover class
  id_=$(e.target).attr('id');
  //get sequence id,i and j, from id_
  slashIndex=id_.indexOf('_');
  seqID=id_.substring(0,slashIndex); //works
  apoIndex=id_.lastIndexOf('_');
  i=id_.substring(slashIndex+1,apoIndex);
  j=id_.substring(apoIndex+1);


  //construct 6 elements from the above information
  //sequence 0, i, j/ structure 0, i, j/ sequence 0 j, i/ structure 0, j i etc...
  //sequence 1, i, j/ structure 1, i, j/ sequence 1 j, i/ structure 1, j i etc...
  //sequence 2, i, j/ structure 2, i, j/ sequence 2 j, i/ structure 2, j i etc...
  //if J is 0, then only 6 are constructed, and if j is not 0, then 12 are constructed
  if(j==0){
    counter=0;
    while(counter<3){
      seqHolder="#Seq"+counter+"_"+i+'_'+j;
      strucHolder="#Stru"+counter+"_"+i+"_"+j;
      seqElement=$(seqHolder);
      //console.log(seqElement);
      strucElement=$(strucHolder);
      seqElement.removeClass('myhover');
      strucElement.removeClass('myhover');
      counter= counter+1;
    }
  }
  else{
    count=0;
    while(count<3){
      seqHold="#Seq"+count+"_"+i+'_'+j;
      strucHold="#Stru"+count+"_"+i+"_"+j;
      seqPairHold="#Seq"+count+"_"+j+'_'+i;
      strucPairHold="#Stru"+count+"_"+j+"_"+i;

      seqElem=$(seqHold);
      strucElem=$(strucHold);
      seqPairElem=$(seqPairHold);
      strucPairElem=$(strucPairHold);

      seqElem.removeClass('myhover');
      strucElem.removeClass('myhover');
      seqPairElem.removeClass('myhover');
      strucPairElem.removeClass('myhover');
      count=count+1;
    }
  }

  
}

$('svg').on('mouseover',  '.tooltips-arcs', function(e){ tooltip_on(e, 'tooltipbox tooltipbox-lg tooltipbox-blue', h2=h2_height, h1=h1_height);  });
$('svg').on('mouseleave', '.tooltips-arcs', function(e){ tooltip_off(e); });

$('svg').on('mouseover',  '.kBestNtArc', function(e){ tooltip_on(e, 'tooltipbox tooltipbox-sm tooltipbox-red');  });
$('svg').on('mouseleave', '.kBestNtArc', function(e){ tooltip_off(e); });

$('span').on('mouseover',  '.alignedNtChangOn', function(e){ tooltip_on(e, 'tooltipbox tooltipbox-sm tooltipbox-red');  });
$('span').on('mouseleave', '.alignedNtChangOn', function(e){ tooltip_off(e); });

$('span').on('mouseover',  '.alignedNtChangOff', function(e){ tooltip_on(e, 'tooltipbox tooltipbox-sm tooltipbox-grey');  });
$('span').on('mouseleave', '.alignedNtChangOff', function(e){ tooltip_off(e); });

$('span').on('mouseover','.test',function(e){tooltip_on(e,'tooltipbox tooltipbox-sm tooltipbox-grey');});
$('span').on('mouseleave','.test',function(e){tooltip_off(e);});

//$('span').on('mouseover','.test',function(e){highlight_on_for_pair(e,'tooltipbox tooltipbox-sm tooltipbox-red');});
//$('span').on('mouseleave','.test',function(e){highlight_off_for_pair(e);})
$('span').on('mouseover','.test',function(e){highlightOn25(e,'tooltipbox tooltipbox-sm tooltipbox-red');});
$('span').on('mouseleave','.test',function(e){highlightOff25(e);})
//end of Evan changes
