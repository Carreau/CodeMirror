CodeMirror.defineMode("ipython", function(conf, parserConf) {
  

  var python_spec = {
          name: 'python',
          indentUnit: 4,
          // extend python one with =! , ??
          doubleOperators : new RegExp("^((==)|(!=)|(<=)|(>=)|(<>)|(<<)|(>>)|(//)|(\\*\\*)|(=!)|(\\?\\?))"),
          singleOperators : new RegExp("^[\\+\\-\\*/%&\\?|\\^~<>!]"), // extend with ?
       }
    
  var mode_map = {
                  'cython':{name:'text/x-cython'},
                  'bash':  {name:'shell'},
                  'python': python_spec,
                  'latex' : 'text/x-stex'
                 };
    
  // cache known modes
  var kmode = {
    miam : { token:function(stream){
      stream.skipToEnd();
      return 'error';
    }},
    scrountch : { token:function(stream){
      stream.skipToEnd();
      return 'def';
    }},
  };
    
  // swap inner mode with new mode
  function swp(state, mode){
      state.innermode = mode;
      var spec = (mode_map[state.innermode]||null)
      var mde = kmode[mode];
      if(!mde){
          kmode[mode] = CodeMirror.getMode({}, spec);
      }
      mde = kmode[mode];
      //console.log(mde, mime, state.innermode);
      if(mde && mde.startState){
          state.innerstate = mde.startState();
      } else {
          state.innerstate = {};    
      }
  }
    
  function blankLine(state){
        state.blanklines = state.blanklines+1;
        if(state.blanklines == 2){
              swp(state, 'python');
        }
  }


  return {
    token: function(stream, state) {
        var m;
        if(stream.sol() && stream.match(/^\s+$/, false)){
            blankLine(state);
            stream.skipToEnd();
            return null;
        } else {
            state.blanklines = 0;
        }
        
        if(stream.sol() && (m=stream.match(/^%%([a-z/-]+)/g, false)) ) {
            var imode = m[0].slice(2,m[0].length);
            swp(state, imode);
            stream.skipToEnd();
            return 'comment ipython-cell-magic';
        }
        
        var mde = kmode[state.innermode]||kmode.python;
        var res = mde.token(stream, state.innerstate);
        return res;
    },


    startState: function(){

        var state = {n:0, innerstate:null, innermode: 'python', blanklines:0};
        swp(state, 'python');
        return state;
    },
      // lineComment:,
      // blockCommentStart:,
      // blockCommentEnd:, 
      // blockCommentLead:,
      // fold:, 
      electricChars: true,// property
      // copyState: ,
      indent:function(state, textAfter){
        if(state.innermode == 'python'){
            var val = kmode[state.innermode].indent(state.innerstate, textAfter);   
            return val;
        } else {
            return 0;
        }
       },
      // innerMode: function(state){return {state:state.innerstate, mode:kmode[state.innermode]};} ,
      // modeProps ??
      blankLine: blankLine
  };
});

CodeMirror.defineMIME("text/x-ipython", "ipython");

