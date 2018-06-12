OBJ_TYPE_ID =130003 인경우에만 그림
SELECT * FROM CM_TYPE WHERE TYPE_ID IN (130003, 130004, 131201, 131202)

블럭 타입
(startWith로 구분)
    - LOOP_EXEC : 
    - StatementBlock : step 없이 DD 문만 존재 하는 경우

orgData -> FCJCLStepData ->

FCJCLStepData
    ExecData
    List<FCJCLDDData> DDList
        List<FCJCLDataSourceDecriptionData> DSNList  (instruction 에서 찾음)


{CM.FC.JCL.Views.Item.StepBlock}
{CM.FC.JCL.Views.Item.DDLink}


노드 타입
(startWith로 구분)
    - DD[               -> typePrefix: "DD"
    - DD_ASSIGN[        -> typePrefix: "DD"
    - DD_FILECMD[       -> typePrefix: "DD"
    - DD_DSN[           -> typePrefix: "DD_DSN"
    - DD_INSTREAM[      -> typePrefix: "DD_INSTREAM"


DSN : 1300003, 1300003
INSTREAM: 1311566, 1312001
STREAM : InstructionList.Count == 0


==================================================================================================



StepBlock
    ExecNode
    DDNode

    public enum ExecPgmType {
        None, IBMDataSetUtiltity, IBMRelatedCobol, Sort, CobolProgram, Empty
    }

    public enum DataSourceType
    {
        Unknown, STREAM, DSN, INSTREAM
    }

    public enum IOType
    {
        In,Out,None , InAndOut, SysInput
    }
    
    public enum Direction
    {
        TopDown, BottomUp, LeftToRight, RightToLeft
    }

