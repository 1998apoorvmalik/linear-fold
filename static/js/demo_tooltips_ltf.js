$tooltipbox = $(".tooltipbox");

function tooltip_on(e, classStr, h2="65px", h1="30px"){
  // console.log($(e.target).attr('id'));
    $tooltipbox.removeClass();
    $tooltipbox.addClass(classStr);
    $tooltipbox.addClass('active');
    $tooltipbox.html($(e.target).attr('id'));
    if ($(e.target).attr('id').includes('<br>')){
      $tooltipbox.css({
         left:  e.pageX - 30,
         top:   e.pageY - 95,
         // padding: "1px 10px", // padding defined in classStr: tooltipbox-lg or tooltipbox-sm
         height: h2
      });
    }else{
      $tooltipbox.css({
         left:  e.pageX,//$(this).attr('id').length+5,
         top:   e.pageY - 60,
         // padding: "1px 10px",
         height: h1

      });
    }
}

function tooltip_off(e){
    $tooltipbox.removeClass('active');
}
//more changes from Evan

function highlightOn25(e,classStr){
  var sequences= $('#seqSelect').val();
  id_=$(e.target).attr('id');
  console.log(id_);
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
  var sequences= $('#seqSelect').val();
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
      var sequences= $('#seqSelect').val();
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

//end of changes

if (window.location.href.includes('/partition/') || window.location.href.includes('/linearturbofold_SarsCov2')){
  h1_height = "30px";
  h2_height = "55px";
}else{
  h1_height = "50px";
  h2_height = "75px";
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
// $('svg').on('mouseover', '.tooltips-arcs', function(e){
//     $tooltipbox.addClass('active');
//     console.log('arc hover '+$(this).attr('id'));
//     $tooltipbox.html($(this).attr('id'));
//   //}, function() {
//   //  $tooltipbox.removeClass('active');
//     if ($(this).attr('id').includes('<br>')){
//        //$tooltipbox.css("height", "50px");
//        $tooltipbox.css({
//            left:  e.pageX - 15,
//            top:   e.pageY - 95,
//            padding: "10px 15px",
//            "height": "75px"
//             });
//     }else{
//        //$tooltipbox.css("height", "30px");
//        $tooltipbox.css({
//            left:  e.pageX - 15,
//            top:   e.pageY - 70,
//            padding: "10px 15px",
//            "height": "50px"
//             });
//     }
//   });


// $('svg').on('mouseleave', '.tooltips-arcs', function(){
//     $tooltipbox.removeClass('active');
//   });


// $tooltipbox_kBestNt = $(".tooltipbox_kBestNt");

// // $this in function(e) is $(e.target)
// function tooltip_kBest_on(e){
//   console.log($(e.target).attr('id'));
//     $tooltipbox_kBestNt.addClass('active');
//     $tooltipbox_kBestNt.html($(e.target).attr('id'));
//     if ($(e.target).attr('id').includes('<br>')){
//       $tooltipbox_kBestNt.css({
//          left:  e.pageX - 30,
//          top:   e.pageY - 95,
//          padding: "1px 10px",
//          height: "65px"
//       });
//     }else{
//       $tooltipbox_kBestNt.css({
//          left:  e.pageX,//$(this).attr('id').length+5,
//          top:   e.pageY - 60,
//          padding: "1px 10px",
//          height: "30px"

//       });
//     }
// }

// function tooltip_kBest_off(e){
//     $tooltipbox_kBestNt.removeClass('active');
// }



// // $('svg').on('mouseover', '.kBestNtArc', function(e) { tooltip_kBest_on(e);  });
// // $('svg').on('mouseleave', '.kBestNtArc', function(e){ tooltip_kBest_off(e); });


// $('span').on('mouseover', '.kbestNt', function(e) { tooltip_kBest_on(e);  });
// $('span').on('mouseleave', '.kbestNt', function(e){ tooltip_kBest_off(e); });














// //$('span.kbestNt').mouseover(function(e){
// $('span').on('mouseover', '.kbestNt', function(e){
//     $tooltipbox.addClass('active');
//     $tooltipbox.html($(this).attr('id'));
//     if ($(this).attr('id').includes('<br>')){
//        //$tooltipbox.css("height", "50px");
//        $tooltipbox.css({
//            left:  e.pageX - 15,
//            top:   e.pageY - 95,
//            "height": "75px"
//             });
//     }else{
//        //$tooltipbox.css("height", "30px");
//        // console.log($tooltipbox.css("width"), e.pageX);
//        $tooltipbox.css({
//            left:  e.pageX,//$(this).attr('id').length+5,
//            top:   e.pageY - 60,
//            padding: "1px 1px",
//            height: "30px"
//             });
//     }
//   });


$tooltipbox_gene_type = $(".tooltipbox_gene_type");
$('svg').on('mouseover', '.tooltips-arcs-gene', function(){
    $tooltipbox_gene_type.addClass('active');
    $tooltipbox_gene_type.html($(this).attr('id'));
  });
$('svg').on('mouseleave', '.tooltips-arcs-gene', function(){
    $tooltipbox_gene_type.removeClass('active');
  });


$(document).on('mousemove', function(e){
  $tooltipbox_gene_type.css({
    left:  e.pageX,
    top:   e.pageY - 70
  });

});
