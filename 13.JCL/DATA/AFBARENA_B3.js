var DATA = {
    "obj": [{
        "oid": "0",
        "poid": "-1",
        "onm": "/home/cmuser/cm90_0502/analyzer/SRC/src/20180612000941/AFBARENA.jcl",
        "ogid": "/home/cmuser/cm90_0502/analyzer/SRC/src/20180612000941/AFBARENA.jcl",
        "otp": "-1",
        "cmoid": ""
    }, {
        "oid": "1",
        "poid": "0",
        "onm": "AFBARENA",
        "ogid": "AFBARENA.jcl",
        "otp": "130001",
        "cmoid": "3703"
    }, {
        "oid": "2",
        "poid": "1",
        "onm": "AFBARENA",
        "ogid": "AFBARENA",
        "otp": "130003",
        "cmoid": "3703000002"
    }],
    "block": [{
        "oid": "2",
        "bid": "2",
        "pbid": "-1",
        "btp": "AFBARENA"
    },{
        "oid": "2",
        "bid": "3",
        "pbid": "2",
        "btp": "StatementBlock"
    }],

    "node": [{
        "bid": "2",
        "nid": "p29",
        "ntp": "STBLOCK_END",
        "sid": "0",
        "sln": "285",
        "eln": "285",
        "onm": "UCLIN",
        "oid": "",
        "pgm_yn": "N",
        "crud": "",
    }, {
        "bid": "3",
        "nid": "p4",
        "ntp": "JOB[AFBARENA]",
        "sid": "0",
        "sln": "1",
        "eln": "285",
        "onm": "AFBARENA",
        "oid": "3703000002",
        "pgm_yn": "N",
        "crud": "",
    }, {
        "bid": "3",
        "nid": "p3",
        "ntp": "STBLOCK_START",
        "sid": "0",
        "sln": "1",
        "eln": "1",
        "onm": "",
        "oid": "",
        "pgm_yn": "N",
        "crud": "",
    }, {
        "bid": "3",
        "nid": "p10",
        "ntp": "STBLOCK_END",
        "sid": "0",
        "sln": "285",
        "eln": "285",
        "onm": "",
        "oid": "",
        "pgm_yn": "N",
        "crud": "",
    }, {
        "bid": "2",
        "nid": "p1",
        "ntp": "STBLOCK_START",
        "sid": "0",
        "sln": "1",
        "eln": "1",
        "onm": "",
        "oid": "",
        "pgm_yn": "N",
        "crud": "",
    }],

    "ins": [{
        "nid": "p5start",
        "iid": "1",
        "itp": "1300001",
        "oid": "AFFEPROC",
        "sln": "56",
        "eln": "129"
    }, {
        "nid": "p8",
        "iid": "0",
        "itp": "1311566",
        "oid": "SET BDY(TVSF2).",
        "sln": "57",
        "eln": "57"
    }, {
        "nid": "p11start",
        "iid": "7",
        "itp": "1300002",
        "oid": "IEWL",
        "sln": "130",
        "eln": "209"
    }, {
        "nid": "p18",
        "iid": "6",
        "itp": "1311566",
        "oid": "INCLUDE SYSLMOD(AFBVRENA)",
        "sln": "141",
        "eln": "141"
    }, {
        "nid": "p17",
        "iid": "4",
        "itp": "1300003",
        "oid": "VSF2.AFBLBM",
        "sln": "135",
        "eln": "135"
    }, {
        "nid": "p17",
        "iid": "5",
        "itp": "1311514",
        "oid": "SHR",
        "sln": "135",
        "eln": "135"
    }, {
        "nid": "p16",
        "iid": "2",
        "itp": "1300003",
        "oid": "VSF2.VSF2FORT",
        "sln": "134",
        "eln": "134"
    }, {
        "nid": "p16",
        "iid": "3",
        "itp": "1311514",
        "oid": "OLD",
        "sln": "134",
        "eln": "134"
    }, {
        "nid": "p20start",
        "iid": "13",
        "itp": "1300002",
        "oid": "IEWL",
        "sln": "210",
        "eln": "285"
    }, {
        "nid": "p27",
        "iid": "12",
        "itp": "1311566",
        "oid": " INCLUDE SYSLMOD(AFBVRENA)....",
        "sln": "221",
        "eln": "221"
    }, {
        "nid": "p26",
        "iid": "10",
        "itp": "1300003",
        "oid": "VSF2.AFBLBM",
        "sln": "215",
        "eln": "215"
    }, {
        "nid": "p26",
        "iid": "11",
        "itp": "1311514",
        "oid": "SHR",
        "sln": "215",
        "eln": "215"
    },{
        "nid": "p25",
        "iid": "8",
        "itp": "1300003",
        "oid": "VSF2.VSF2LOAD",
        "sln": "214",
        "eln": "214"
    },{
        "nid": "p25",
        "iid": "9",
        "itp": "1311514",
        "oid": "OLD",
        "sln": "214",
        "eln": "214"
    }],

    "edge": [{
        "fnid": "p5start",
        "tnid": "p7",
        "etp": "direct"
    }, {
        "fnid": "p5end",
        "tnid": "p11start",
        "etp": "direct"
    }, {
        "fnid": "p9",
        "tnid": "p5end",
        "etp": "direct"
    }, {
        "fnid": "p8",
        "tnid": "p9",
        "etp": "direct"
    }, {
        "fnid": "p7",
        "tnid": "p8",
        "etp": "direct"
    }, {
        "fnid": "p11start",
        "tnid": "p13",
        "etp": "direct"
    }, {
        "fnid": "p11end",
        "tnid": "p20start",
        "etp": "direct"
    }, {
        "fnid": "p18",
        "tnid": "p19",
        "etp": "direct"
    }, {
        "fnid": "p17",
        "tnid": "p18",
        "etp": "direct"
    }, {
        "fnid": "p16",
        "tnid": "p17",
        "etp": "direct"
    }, {
        "fnid": "p15",
        "tnid": "p16",
        "etp": "direct"
    }, {
        "fnid": "p14",
        "tnid": "p15",
        "etp": "direct"
    }, {
        "fnid": "p13",
        "tnid": "p14",
        "etp": "direct"
    }, {
        "fnid": "p19",
        "tnid": "p11end",
        "etp": "direct"
    }, {
        "fnid": "p4",
        "tnid": "p10",
        "etp": "direct"
    }, {
        "fnid": "p3",
        "tnid": "p4",
        "etp": "direct"
    }, {
        "fnid": "p10",
        "tnid": "p5start",
        "etp": "direct"
    }, {
        "fnid": "p1",
        "tnid": "p3",
        "etp": "direct"
    }, {
        "fnid": "p20start",
        "tnid": "p22",
        "etp": "direct"
    }, {
        "fnid": "p20end",
        "tnid": "p29",
        "etp": "direct"
    }, {
        "fnid": "p28",
        "tnid": "p20end",
        "etp": "direct"
    }, {
        "fnid": "p27",
        "tnid": "p28",
        "etp": "direct"
    }, {
        "fnid": "p26",
        "tnid": "p27",
        "etp": "direct"
    }, {
        "fnid": "p25",
        "tnid": "p26",
        "etp": "direct"
    }, {
        "fnid": "p24",
        "tnid": "p25",
        "etp": "direct"
    }, {
        "fnid": "p23",
        "tnid": "p24",
        "etp": "direct"
    }, {
        "fnid": "p22",
        "tnid": "p23",
        "etp": "direct"
    }],

    "src": [{
        "sid": "0",
        "spath": "/home/cmuser/cm90_0502/analyzer/SRC/src/20180612000941/AFBARENA.jcl",
        "cmsid": "3703"
    }],

    "text": [{
        "nid": "p5start",
        "txt": "//UCLIN EXEC PROC=AFFEPROC"
    }, {
        "nid": "p8",
        "txt": "//SMPCNTL DD *"
    }, {
        "nid": "p11start",
        "txt": "//LINK1 EXEC PGM=IEWL,PARM='XREF,RENT,NCAL,LIST,MAP'"
    }, {
        "nid": "p18",
        "txt": "//SYSLIN DD *"
    }, {
        "nid": "p17",
        "txt": "//SYSLIB DD DSN=VSF2.AFBLBM,DISP=SHR"
    }, {
        "nid": "p16",
        "txt": "//SYSLMOD DD DSN=VSF2.VSF2FORT,DISP=OLD"
    }, {
        "nid": "p15",
        "txt": "//SYSUT1 DD UNIT=SYSDA,SPACE=(CYL,(1,1))"
    }, {
        "nid": "p14",
        "txt": "//SYSPRINT DD SYSOUT=*"
    }, {
        "nid": "p4",
        "txt": "//AFBARENA JOB 1"
    }, {
        "nid": "p20start",
        "txt": "//LINK2 EXEC PGM=IEWL,PARM='XREF,RENT,NCAL,LIST,MAP'"
    }, {
        "nid": "p27",
        "txt": "//SYSLIN DD *"
    }, {
        "nid": "p26",
        "txt": "//SYSLIB DD DSN=VSF2.AFBLBM,DISP=SHR"
    }, {
        "nid": "p25",
        "txt": "//SYSLMOD DD DSN=VSF2.VSF2LOAD,DISP=OLD"
    }, {
        "nid": "p24",
        "txt": "//SYSUT1 DD UNIT=SYSDA,SPACE=(CYL,(1,1))"
    }, {
        "nid": "p23",
        "txt": "//SYSPRINT DD SYSOUT=*"
    }]
}
