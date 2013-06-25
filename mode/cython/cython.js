CodeMirror.defineMode("cython", function(conf, parserConf){
    parserConf = parserConf ||{}
    conf = conf ||{}
    parserConf.name = 'python-like';
    parserConf.extra_keyword = ['cimport'];
    console.log('her');
    return CodeMirror.getMode(conf, parserConf);
    parserConf.name = 'cython';
});
