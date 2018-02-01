var CM_COLLECT_SET_DELETE =
{
    "obj": [
        {
            "oid": "0",
            "poid": "-1",
            "onm": "/home/cmuser/mmdl/analyzer/SRC/src/20180130000289/36311",
            "ogid": "/home/cmuser/mmdl/analyzer/SRC/src/20180130000289/36311",
            "otp": "101001",
            "cmoid": ""
        },
        {
            "oid": "2",
            "poid": "0",
            "onm": "FP_RELATION_STAT",
            "ogid": "FP_RELATION_STAT",
            "otp": "101003",
            "cmoid": ""
        },
        {
            "oid": "4",
            "poid": "2",
            "onm": "INS_REL",
            "ogid": "FP_RELATION_STAT/INS_REL",
            "otp": "101005",
            "cmoid": "36311000009"
        },
        {
            "oid": "3",
            "poid": "2",
            "onm": "INS_TMP_TABLE",
            "ogid": "FP_RELATION_STAT/INS_TMP_TABLE",
            "otp": "101005",
            "cmoid": "36311000006"
        },
        {
            "oid": "5",
            "poid": "2",
            "onm": "MAIN",
            "ogid": "FP_RELATION_STAT/MAIN",
            "otp": "101005",
            "cmoid": "36311000016"
        },
        {
            "oid": "1",
            "poid": "0",
            "onm": "36311",
            "ogid": "36311",
            "otp": "101001",
            "cmoid": ""
        }
    ],
    "block": [
        {
            "oid": "4",
            "bid": "4",
            "pbid": "-1",
            "btp": "FP_RELATION_STAT/INS_REL"
        },
        {
            "oid": "4",
            "bid": "8",
            "pbid": "4",
            "btp": "StatementBlock"
        },
        {
            "oid": "4",
            "bid": "5",
            "pbid": "4",
            "btp": "StatementBlock"
        },
        {
            "oid": "4",
            "bid": "6",
            "pbid": "4",
            "btp": "LOOP_loop"
        },
        {
            "oid": "4",
            "bid": "7",
            "pbid": "6",
            "btp": "StatementBlock"
        },
        {
            "oid": "3",
            "bid": "3",
            "pbid": "-1",
            "btp": "FP_RELATION_STAT/INS_TMP_TABLE"
        },
        {
            "oid": "5",
            "bid": "9",
            "pbid": "-1",
            "btp": "FP_RELATION_STAT/MAIN"
        },
        {
            "oid": "5",
            "bid": "11",
            "pbid": "9",
            "btp": "IF"
        },
        {
            "oid": "5",
            "bid": "12",
            "pbid": "11",
            "btp": "StatementBlock"
        },
        {
            "oid": "5",
            "bid": "15",
            "pbid": "9",
            "btp": "StatementBlock"
        },
        {
            "oid": "5",
            "bid": "10",
            "pbid": "9",
            "btp": "StatementBlock"
        },
        {
            "oid": "5",
            "bid": "16",
            "pbid": "9",
            "btp": "IF"
        },
        {
            "oid": "5",
            "bid": "17",
            "pbid": "16",
            "btp": "StatementBlock"
        },
        {
            "oid": "5",
            "bid": "13",
            "pbid": "9",
            "btp": "LOOP_for"
        },
        {
            "oid": "5",
            "bid": "14",
            "pbid": "13",
            "btp": "StatementBlock"
        }
    ],
    "node": [
        {
            "bid": "4",
            "nid": "p31",
            "ntp": "STBLOCK_END",
            "sid": null,
            "sln": "97",
            "eln": "97"
        },
        {
            "bid": "8",
            "nid": "p30",
            "ntp": "STBLOCK_END",
            "sid": null,
            "sln": "97",
            "eln": "97"
        },
        {
            "bid": "8",
            "nid": "p29",
            "ntp": "etc",
            "sid": null,
            "sln": "97",
            "eln": "97"
        },
        {
            "bid": "8",
            "nid": "p28",
            "ntp": "etc",
            "sid": null,
            "sln": "87",
            "eln": "95"
        },
        {
            "bid": "8",
            "nid": "p27",
            "ntp": "STBLOCK_START",
            "sid": null,
            "sln": "87",
            "eln": "87"
        },
        {
            "bid": "5",
            "nid": "p18",
            "ntp": "etc",
            "sid": null,
            "sln": "78",
            "eln": "80"
        },
        {
            "bid": "5",
            "nid": "p17",
            "ntp": "etc",
            "sid": null,
            "sln": "72",
            "eln": "76"
        },
        {
            "bid": "5",
            "nid": "p16",
            "ntp": "Variable Declaration",
            "sid": null,
            "sln": "68",
            "eln": "68"
        },
        {
            "bid": "5",
            "nid": "p15",
            "ntp": "Variable Declaration",
            "sid": null,
            "sln": "67",
            "eln": "67"
        },
        {
            "bid": "5",
            "nid": "p14",
            "ntp": "Variable Declaration",
            "sid": null,
            "sln": "66",
            "eln": "66"
        },
        {
            "bid": "5",
            "nid": "p25",
            "ntp": "STBLOCK_END",
            "sid": null,
            "sln": "80",
            "eln": "80"
        },
        {
            "bid": "5",
            "nid": "p13",
            "ntp": "Variable Declaration",
            "sid": null,
            "sln": "65",
            "eln": "65"
        },
        {
            "bid": "5",
            "nid": "p12",
            "ntp": "STBLOCK_START",
            "sid": null,
            "sln": "65",
            "eln": "65"
        },
        {
            "bid": "4",
            "nid": "p10",
            "ntp": "STBLOCK_START",
            "sid": null,
            "sln": "65",
            "eln": "65"
        },
        {
            "bid": "6",
            "nid": "p19start",
            "ntp": "LOOP_loop_START",
            "sid": null,
            "sln": "82",
            "eln": "82"
        },
        {
            "bid": "6",
            "nid": "p19end",
            "ntp": "LOOP_loop_END",
            "sid": null,
            "sln": "85",
            "eln": "85"
        },
        {
            "bid": "7",
            "nid": "p24",
            "ntp": "STBLOCK_END",
            "sid": null,
            "sln": "84",
            "eln": "84"
        },
        {
            "bid": "7",
            "nid": "p23",
            "ntp": "exit",
            "sid": null,
            "sln": "84",
            "eln": "84"
        },
        {
            "bid": "7",
            "nid": "p22",
            "ntp": "etc",
            "sid": null,
            "sln": "83",
            "eln": "83"
        },
        {
            "bid": "7",
            "nid": "p21",
            "ntp": "STBLOCK_START",
            "sid": null,
            "sln": "83",
            "eln": "83"
        },
        {
            "bid": "3",
            "nid": "p9",
            "ntp": "STBLOCK_END",
            "sid": null,
            "sln": "59",
            "eln": "59"
        },
        {
            "bid": "3",
            "nid": "p8",
            "ntp": "etc",
            "sid": null,
            "sln": "52",
            "eln": "59"
        },
        {
            "bid": "3",
            "nid": "p7",
            "ntp": "etc",
            "sid": null,
            "sln": "50",
            "eln": "50"
        },
        {
            "bid": "3",
            "nid": "p6",
            "ntp": "etc",
            "sid": null,
            "sln": "47",
            "eln": "48"
        },
        {
            "bid": "3",
            "nid": "p5",
            "ntp": "etc",
            "sid": null,
            "sln": "45",
            "eln": "45"
        },
        {
            "bid": "3",
            "nid": "p4",
            "ntp": "etc",
            "sid": null,
            "sln": "18",
            "eln": "43"
        },
        {
            "bid": "3",
            "nid": "p3",
            "ntp": "etc",
            "sid": null,
            "sln": "14",
            "eln": "16"
        },
        {
            "bid": "3",
            "nid": "p2",
            "ntp": "Variable Declaration",
            "sid": null,
            "sln": "12",
            "eln": "12"
        },
        {
            "bid": "3",
            "nid": "p1",
            "ntp": "STBLOCK_START",
            "sid": null,
            "sln": "12",
            "eln": "12"
        },
        {
            "bid": "9",
            "nid": "p65",
            "ntp": "STBLOCK_END",
            "sid": null,
            "sln": "162",
            "eln": "162"
        },
        {
            "bid": "11",
            "nid": "p38start",
            "ntp": "IF_START",
            "sid": null,
            "sln": "117",
            "eln": "117"
        },
        {
            "bid": "11",
            "nid": "p38end",
            "ntp": "IF_END",
            "sid": null,
            "sln": "120",
            "eln": "120"
        },
        {
            "bid": "12",
            "nid": "p42",
            "ntp": "STBLOCK_END",
            "sid": null,
            "sln": "119",
            "eln": "119"
        },
        {
            "bid": "12",
            "nid": "p41",
            "ntp": "etc",
            "sid": null,
            "sln": "119",
            "eln": "119"
        },
        {
            "bid": "12",
            "nid": "p40",
            "ntp": "STBLOCK_START",
            "sid": null,
            "sln": "119",
            "eln": "119"
        },
        {
            "bid": "15",
            "nid": "p55",
            "ntp": "etc",
            "sid": null,
            "sln": "159",
            "eln": "159"
        },
        {
            "bid": "15",
            "nid": "p54",
            "ntp": "etc",
            "sid": null,
            "sln": "157",
            "eln": "157"
        },
        {
            "bid": "15",
            "nid": "p53",
            "ntp": "etc",
            "sid": null,
            "sln": "149",
            "eln": "155"
        },
        {
            "bid": "15",
            "nid": "p64",
            "ntp": "STBLOCK_END",
            "sid": null,
            "sln": "159",
            "eln": "159"
        },
        {
            "bid": "15",
            "nid": "p52",
            "ntp": "etc",
            "sid": null,
            "sln": "139",
            "eln": "147"
        },
        {
            "bid": "15",
            "nid": "p51",
            "ntp": "STBLOCK_START",
            "sid": null,
            "sln": "139",
            "eln": "139"
        },
        {
            "bid": "10",
            "nid": "p43",
            "ntp": "STBLOCK_END",
            "sid": null,
            "sln": "115",
            "eln": "115"
        },
        {
            "bid": "10",
            "nid": "p37",
            "ntp": "etc",
            "sid": null,
            "sln": "115",
            "eln": "115"
        },
        {
            "bid": "10",
            "nid": "p36",
            "ntp": "etc",
            "sid": null,
            "sln": "105",
            "eln": "113"
        },
        {
            "bid": "10",
            "nid": "p35",
            "ntp": "Variable Declaration",
            "sid": null,
            "sln": "102",
            "eln": "102"
        },
        {
            "bid": "10",
            "nid": "p34",
            "ntp": "STBLOCK_START",
            "sid": null,
            "sln": "102",
            "eln": "102"
        },
        {
            "bid": "16",
            "nid": "p56start",
            "ntp": "IF_START",
            "sid": null,
            "sln": "162",
            "eln": "162"
        },
        {
            "bid": "16",
            "nid": "p56end",
            "ntp": "IF_END",
            "sid": null,
            "sln": "162",
            "eln": "162"
        },
        {
            "bid": "17",
            "nid": "p63",
            "ntp": "STBLOCK_END",
            "sid": null,
            "sln": "166",
            "eln": "166"
        },
        {
            "bid": "17",
            "nid": "p62",
            "ntp": "etc",
            "sid": null,
            "sln": "166",
            "eln": "166"
        },
        {
            "bid": "17",
            "nid": "p61",
            "ntp": "etc",
            "sid": null,
            "sln": "165",
            "eln": "165"
        },
        {
            "bid": "17",
            "nid": "p60",
            "ntp": "etc",
            "sid": null,
            "sln": "164",
            "eln": "164"
        },
        {
            "bid": "17",
            "nid": "p59",
            "ntp": "etc",
            "sid": null,
            "sln": "163",
            "eln": "163"
        },
        {
            "bid": "17",
            "nid": "p58",
            "ntp": "STBLOCK_START",
            "sid": null,
            "sln": "163",
            "eln": "163"
        },
        {
            "bid": "13",
            "nid": "p44start",
            "ntp": "LOOP_for_START",
            "sid": null,
            "sln": "122",
            "eln": "122"
        },
        {
            "bid": "13",
            "nid": "p44end",
            "ntp": "LOOP_for_END",
            "sid": null,
            "sln": "137",
            "eln": "137"
        },
        {
            "bid": "14",
            "nid": "p49",
            "ntp": "STBLOCK_END",
            "sid": null,
            "sln": "135",
            "eln": "135"
        },
        {
            "bid": "14",
            "nid": "p48",
            "ntp": "etc",
            "sid": null,
            "sln": "135",
            "eln": "135"
        },
        {
            "bid": "14",
            "nid": "p47",
            "ntp": "etc",
            "sid": null,
            "sln": "134",
            "eln": "134"
        },
        {
            "bid": "14",
            "nid": "p46",
            "ntp": "STBLOCK_START",
            "sid": null,
            "sln": "134",
            "eln": "134"
        },
        {
            "bid": "9",
            "nid": "p32",
            "ntp": "STBLOCK_START",
            "sid": null,
            "sln": "102",
            "eln": "102"
        }
    ],
    "ins": [],
    "edge": [
        {
            "fnid": "p30",
            "tnid": "p31",
            "etp": "direct"
        },
        {
            "fnid": "p29",
            "tnid": "p30",
            "etp": "direct"
        },
        {
            "fnid": "p28",
            "tnid": "p29",
            "etp": "direct"
        },
        {
            "fnid": "p27",
            "tnid": "p28",
            "etp": "direct"
        },
        {
            "fnid": "p18",
            "tnid": "p25",
            "etp": "direct"
        },
        {
            "fnid": "p17",
            "tnid": "p18",
            "etp": "direct"
        },
        {
            "fnid": "p16",
            "tnid": "p17",
            "etp": "direct"
        },
        {
            "fnid": "p15",
            "tnid": "p16",
            "etp": "direct"
        },
        {
            "fnid": "p14",
            "tnid": "p15",
            "etp": "direct"
        },
        {
            "fnid": "p25",
            "tnid": "p19start",
            "etp": "direct"
        },
        {
            "fnid": "p13",
            "tnid": "p14",
            "etp": "direct"
        },
        {
            "fnid": "p12",
            "tnid": "p13",
            "etp": "direct"
        },
        {
            "fnid": "p10",
            "tnid": "p12",
            "etp": "direct"
        },
        {
            "fnid": "p19start",
            "tnid": "p21",
            "etp": "direct"
        },
        {
            "fnid": "p19end",
            "tnid": "p27",
            "etp": "direct"
        },
        {
            "fnid": "p24",
            "tnid": "p19end",
            "etp": "direct"
        },
        {
            "fnid": "p23",
            "tnid": "p24",
            "etp": "direct"
        },
        {
            "fnid": "p22",
            "tnid": "p23",
            "etp": "direct"
        },
        {
            "fnid": "p21",
            "tnid": "p22",
            "etp": "direct"
        },
        {
            "fnid": "p8",
            "tnid": "p9",
            "etp": "direct"
        },
        {
            "fnid": "p7",
            "tnid": "p8",
            "etp": "direct"
        },
        {
            "fnid": "p6",
            "tnid": "p7",
            "etp": "direct"
        },
        {
            "fnid": "p5",
            "tnid": "p6",
            "etp": "direct"
        },
        {
            "fnid": "p4",
            "tnid": "p5",
            "etp": "direct"
        },
        {
            "fnid": "p3",
            "tnid": "p4",
            "etp": "direct"
        },
        {
            "fnid": "p2",
            "tnid": "p3",
            "etp": "direct"
        },
        {
            "fnid": "p1",
            "tnid": "p2",
            "etp": "direct"
        },
        {
            "fnid": "p38start",
            "tnid": "p38end",
            "etp": "direct"
        },
        {
            "fnid": "p38start",
            "tnid": "p40",
            "etp": "direct"
        },
        {
            "fnid": "p38end",
            "tnid": "p44start",
            "etp": "direct"
        },
        {
            "fnid": "p42",
            "tnid": "p38end",
            "etp": "direct"
        },
        {
            "fnid": "p41",
            "tnid": "p42",
            "etp": "direct"
        },
        {
            "fnid": "p40",
            "tnid": "p41",
            "etp": "direct"
        },
        {
            "fnid": "p55",
            "tnid": "p64",
            "etp": "direct"
        },
        {
            "fnid": "p54",
            "tnid": "p55",
            "etp": "direct"
        },
        {
            "fnid": "p53",
            "tnid": "p54",
            "etp": "direct"
        },
        {
            "fnid": "p64",
            "tnid": "p56start",
            "etp": "direct"
        },
        {
            "fnid": "p52",
            "tnid": "p53",
            "etp": "direct"
        },
        {
            "fnid": "p51",
            "tnid": "p52",
            "etp": "direct"
        },
        {
            "fnid": "p43",
            "tnid": "p38start",
            "etp": "direct"
        },
        {
            "fnid": "p37",
            "tnid": "p43",
            "etp": "direct"
        },
        {
            "fnid": "p36",
            "tnid": "p37",
            "etp": "direct"
        },
        {
            "fnid": "p35",
            "tnid": "p36",
            "etp": "direct"
        },
        {
            "fnid": "p34",
            "tnid": "p35",
            "etp": "direct"
        },
        {
            "fnid": "p56start",
            "tnid": "p56end",
            "etp": "direct"
        },
        {
            "fnid": "p56start",
            "tnid": "p58",
            "etp": "direct"
        },
        {
            "fnid": "p56end",
            "tnid": "p65",
            "etp": "direct"
        },
        {
            "fnid": "p63",
            "tnid": "p56end",
            "etp": "direct"
        },
        {
            "fnid": "p62",
            "tnid": "p63",
            "etp": "direct"
        },
        {
            "fnid": "p61",
            "tnid": "p62",
            "etp": "direct"
        },
        {
            "fnid": "p60",
            "tnid": "p61",
            "etp": "direct"
        },
        {
            "fnid": "p59",
            "tnid": "p60",
            "etp": "direct"
        },
        {
            "fnid": "p58",
            "tnid": "p59",
            "etp": "direct"
        },
        {
            "fnid": "p44start",
            "tnid": "p46",
            "etp": "direct"
        },
        {
            "fnid": "p44end",
            "tnid": "p51",
            "etp": "direct"
        },
        {
            "fnid": "p49",
            "tnid": "p44end",
            "etp": "direct"
        },
        {
            "fnid": "p48",
            "tnid": "p49",
            "etp": "direct"
        },
        {
            "fnid": "p47",
            "tnid": "p48",
            "etp": "direct"
        },
        {
            "fnid": "p46",
            "tnid": "p47",
            "etp": "direct"
        },
        {
            "fnid": "p32",
            "tnid": "p34",
            "etp": "direct"
        }
    ],
    "src": [],
    "text": [
        {
            "nid": "/home/cmuser/mmdl/analyzer/SRC/src/20180130000289/36311",
            "txt": "36311"
        },
        {
            "nid": "p29",
            "txt": "v_cnt := SQL % ROWCOUNT;"
        },
        {
            "nid": "p28",
            "txt": "INSERT INTO FP_BF_DAO_MAP ( SRC_ID , DAO_OBJ_ID ) SELECT DISTINCT p_src_id , DAO_OBJ_ID FROM ( SELECT CALLEE_OBJ_ID FROM FPGT_DAO_HRCY CONNECT BY CALLER_OBJ_ID = PRIOR CALLEE_OBJ_ID START WITH CALLER_OBJ_ID = 0 ) A , ( SELECT DAO_OBJ_ID FROM FP_DAO ) B WHERE CALLEE_OBJ_ID = B . DAO_OBJ_ID ;"
        },
        {
            "nid": "p18",
            "txt": "INSERT INTO FPGT_DAO_HRCY ( CALLER_OBJ_ID , CALLEE_OBJ_ID , seq ) SELECT 0 , OBJ_ID , ROWNUM FROM FPGT_OBJ_ID ;"
        },
        {
            "nid": "p17",
            "txt": "INSERT INTO FPGT_OBJ_ID SELECT DISTINCT CALLER_OBJ_ID FROM FP_OBJ_CALL_MAP WHERE CALLER_SRC_ID = p_src_id AND CALLER_ANALYZE_TYPE_ID = p_analyze_type_id ;"
        },
        {
            "nid": "p16",
            "txt": "v_cnt NUMBER := 0 ;"
        },
        {
            "nid": "p15",
            "txt": "v_msg varchar2 ( 1024 ) ;"
        },
        {
            "nid": "p14",
            "txt": "seq NUMBER ;"
        },
        {
            "nid": "p13",
            "txt": "chk_val NUMBER ;"
        },
        {
            "nid": "p19start",
            "txt": ""
        },
        {
            "nid": "p23",
            "txt": "EXIT WHEN chk_val = 0;"
        },
        {
            "nid": "p22",
            "txt": "ins_tmp_table ( chk_val );"
        },
        {
            "nid": "p8",
            "txt": "INSERT INTO FPGT_OBJ_ID SELECT DISTINCT CALLEE_OBJ_ID FROM FPGT_DAO_HRCY WHERE SEQ > v_cnt AND CALLER_OBJ_ID > 0 AND CALLEE_OBJ_ID > 0 MINUS SELECT OBJ_ID FROM FPGT_ORG_OBJ_ID ;"
        },
        {
            "nid": "p7",
            "txt": "DELETE FROM FPGT_OBJ_ID ;"
        },
        {
            "nid": "p6",
            "txt": "INSERT INTO FPGT_ORG_OBJ_ID SELECT OBJ_ID FROM FPGT_OBJ_ID ;"
        },
        {
            "nid": "p5",
            "txt": "rtn_cnt := SQL % ROWCOUNT;"
        },
        {
            "nid": "p4",
            "txt": "INSERT INTO FPGT_DAO_HRCY ( CALLER_OBJ_ID , CALLEE_OBJ_ID , SEQ ) WITH CALL_MAP_NEW AS ( SELECT DISTINCT Y . CALLER_OBJ_ID , Y . CALLEE_OBJ_ID FROM FPGT_OBJ_ID X , FP_OBJ_CALL_MAP Y , CM_TYPE T WHERE X . OBJ_ID = Y . CALLER_OBJ_ID AND Y . DPD_TYPE_ID = T . TYPE_ID AND T . DISPLAY_YN = 'Y' AND NOT EXISTS ( SELECT 1 FROM FP_OBJ_CALL_MAP Z WHERE Y . CALLEE_OBJ_ID = Z . CALLER_OBJ_ID AND Y . CALLER_OBJ_ID = Z . CALLEE_OBJ_ID ) ) SELECT CALLER_OBJ_ID , CALLEE_OBJ_ID , B . CNT_NUM + ROWNUM AS SEQ FROM ( SELECT CALLER_OBJ_ID , CALLEE_OBJ_ID FROM CALL_MAP_NEW A WHERE NOT EXISTS ( SELECT 1 FROM FPGT_DAO_HRCY X WHERE X . CALLER_OBJ_ID = A . CALLEE_OBJ_ID ) AND NOT EXISTS ( SELECT 1 FROM FPGT_DAO_HRCY X WHERE X . CALLER_OBJ_ID = A . CALLER_OBJ_ID AND X . CALLEE_OBJ_ID = A . CALLEE_OBJ_ID ) AND NOT EXISTS ( SELECT 1 FROM FPGT_DAO_HRCY X WHERE X . CALLER_OBJ_ID = A . CALLEE_OBJ_ID AND X . CALLEE_OBJ_ID = A . CALLER_OBJ_ID ) ) A , ( SELECT v_cnt AS CNT_NUM FROM DUAL ) B ;"
        },
        {
            "nid": "p3",
            "txt": "SELECT COUNT ( * ) INTO v_cnt FROM FPGT_DAO_HRCY ;"
        },
        {
            "nid": "p2",
            "txt": "v_cnt INTEGER ;"
        },
        {
            "nid": "p38start",
            "txt": "cnt > 0 "
        },
        {
            "nid": "p41",
            "txt": "DELETE FROM FP_BF_DAO_MAP WHERE SRC_ID IN ( SELECT SRC_ID FROM CMGT_SRC_ID ) ;"
        },
        {
            "nid": "p40",
            "txt": "THEN"
        },
        {
            "nid": "p55",
            "txt": "FP_PROC_SET_END_JOB_INFO ( v_analyze_type_id , 'RELATION' );"
        },
        {
            "nid": "p54",
            "txt": "COMMIT;"
        },
        {
            "nid": "p53",
            "txt": "INSERT INTO FP_BF_DAO_MAP ( SRC_ID , DAO_OBJ_ID ) SELECT A . DAO_SRC_ID , A . DAO_OBJ_ID FROM FP_DAO A WHERE NOT EXISTS ( SELECT 1 FROM FP_BF_DAO_MAP B WHERE A . DAO_OBJ_ID = B . DAO_OBJ_ID AND ROWNUM = 1 ) AND A . DAO_SRC_ID IN ( SELECT SRC_ID FROM CMGT_SRC_ID ) ;"
        },
        {
            "nid": "p52",
            "txt": "INSERT INTO CMGT_SRC_ID SELECT A . SRC_ID FROM CM_ANALYZE_TYPE_FILTER B , CM_SRC A WHERE A . ANALYZE_FILTER_ID = B . ANALYZE_FILTER_ID AND B . ANALYZE_TYPE_ID = v_analyze_type_id AND A . CM_DATE || A . CM_TIME > ( SELECT NVL ( MAX ( CM_DATE || CM_TIME ) , 0 ) FROM FP_END_JOB_INFO WHERE ANALYZE_TYPE_ID = v_analyze_type_id AND STEP_CODE = 'RELATION' ) ;"
        },
        {
            "nid": "p37",
            "txt": "cnt := SQL % ROWCOUNT;"
        },
        {
            "nid": "p36",
            "txt": "INSERT INTO CMGT_SRC_ID SELECT A . SRC_ID FROM CM_ANALYZE_TYPE_FILTER B , CM_SRC A WHERE A . ANALYZE_FILTER_ID = B . ANALYZE_FILTER_ID AND B . ANALYZE_TYPE_ID = v_analyze_type_id AND A . CM_DATE || A . CM_TIME > ( SELECT NVL ( MAX ( CM_DATE || CM_TIME ) , 0 ) FROM FP_END_JOB_INFO WHERE ANALYZE_TYPE_ID = v_analyze_type_id AND STEP_CODE = 'RELATION' ) ;"
        },
        {
            "nid": "p35",
            "txt": "cnt NUMBER := 0 ;"
        },
        {
            "nid": "p56start",
            "txt": "OTHERS "
        },
        {
            "nid": "p62",
            "txt": "RAISE ;"
        },
        {
            "nid": "p61",
            "txt": "ROLLBACK;"
        },
        {
            "nid": "p60",
            "txt": "Dbms_Output . Put_Line ( 'Error message : ' || SQLERRM );"
        },
        {
            "nid": "p59",
            "txt": "Dbms_Output . Put_Line ( 'Error code : ' || SQLCODE );"
        },
        {
            "nid": "p58",
            "txt": "THEN"
        },
        {
            "nid": "p44start",
            "txt": "SRC_LIST in (SELECT DISTINCT I.SRC_ID\n                         FROM CMGT_SRC_ID I, CM_SRC S, FP_OBJ_CALL_MAP CM\n                        WHERE I.SRC_ID = S.SRC_ID\n                          AND S.CHANGE_REASON_CODE < 9000\n                          AND S.SRC_ID = CM.CALLER_SRC_ID\n                          AND NOT EXISTS (SELECT 1 \n                                            FROM FP_OBJ_CALL_MAP C\n                                           WHERE I.SRC_ID = C.CALLEE_SRC_ID\n                                             AND C.CALLER_SRC_ID != C.CALLEE_SRC_ID) \n                      )"
        },
        {
            "nid": "p48",
            "txt": "COMMIT;"
        },
        {
            "nid": "p47",
            "txt": "ins_rel ( src_list . src_id , v_analyze_type_id );"
        }
    ]
}