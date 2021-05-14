import React from 'react'
import formService from '../../services/formService';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {Doughnut} from 'react-chartjs-2';

const state = {
    labels: ['January', 'February'],
    datasets: [
      {
        label: 'Rainfall',
        backgroundColor: [
          '#B21F00',
          '#C9DE00',
          '#2FDE00',
          '#00A6B4',
          '#6800B4'
        ],
        hoverBackgroundColor: [
        '#501800',
        '#4B5000',
        '#175000',
        '#003350',
        '#35014F'
        ],
        data: [65, 59, 80, 81]
      }
    ]
  }

var used = 0

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

function AnalysisTab(props) {
  const classes = useStyles();

  const [formData, setFormData] = React.useState({});
  const [AnalysisData, setAnalysisData] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);
  

    React.useEffect(() => {
      if(props.formData){
        console.log(props.formData.questions.length);
        setQuestions(props.formData.questions)
        setFormData(props.formData)
      }
      var formId = props.formId
      if(formId !== undefined && formId !== ""){
        formService.getResponse(formId)
        .then((data) => { 
            console.log(data);     
            setAnalysisData(data)
           },
           error => {
           const resMessage =
               (error.Analysis &&
               error.Analysis.data &&
               error.Analysis.data.message) ||
               error.message ||
               error.toString();
               console.log(resMessage);
           }
       );
      }
    },[props.formId, props.formData]);


    function getSelectedOption(qId, i, j){
        var oneResData = AnalysisData[j];

        var selectedOp = oneResData.response.filter(qss => qss.questionId === qId);
        //console.log(selectedOp);

        if(selectedOp.length > 0){

            var finalOption = questions[i].options.find(oo => oo._id === selectedOp[0].optionId);
            //console.log(finalOption)
            if(questions[i].options.length!==1){
              if(used === 0){
                used = 1
                var count = 0
                for( let options in questions[i]){
                  state.datasets[0].data.push(0)
                  }
                }
              }else{
                count = 0
                for(let op in questions[i].options){
                  console.log(op)
                }
              }
            

            //console.log(state.datasets[0].data)
            var ans = ""
            { questions[i].options.length!==1 ? ans = finalOption.optionText : ans = selectedOp[0].optionTextvalue}

            return ans
        } else{
            return "not attempted"
        }
    }

    function getQuestionText(ques){
      if(ques.options.length !== 1)state.labels.push(ques.questionText)
      return ques.questionText
    }

  
  return (
    //    <div>
    //       <p> Analysis</p>
    //       <div>
    //         <TableContainer component={Paper}>
    //           <Table className={classes.table} aria-label="simple table">
    //             <TableHead>
    //               <TableRow>
    //                 <TableCell>User</TableCell>
    //                 {questions.map((ques, i)=>(
    //                   <TableCell key={i} align="right">{ques.questionText}</TableCell>
    //                 ))}
    //               </TableRow>
    //             </TableHead>
    //             <TableBody>
    //               {AnalysisData.map((rs, j) => (
    //                 <TableRow key={j}>
    //                   <TableCell component="th" scope="row">
    //                     {rs.userId}
    //                   </TableCell>
    //                   {questions.map((ques, i)=>(
    //                   <TableCell key={i} align="right">{getSelectedOption(ques._id, i,j)}</TableCell>
    //                 ))}
                      
    //                 </TableRow>
    //               ))}
    //             </TableBody>
                
    //           </Table>
    //         </TableContainer>
    //       </div>
    //    </div>
    <div>    
      <p> Analysis</p>
             <TableContainer component={Paper}>
               <Table className={classes.table} aria-label="simple table">
                 <TableHead>
                   <TableRow>
                     <TableCell>User</TableCell>
                     {questions.map((ques, i)=>(
                      <TableCell key={i} align="right">{getQuestionText(ques)}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {AnalysisData.map((rs, j) => (
                    <TableRow key={j}>
                      <TableCell component="th" scope="row">
                        {rs.userId}
                      </TableCell>
                      {questions.map((ques, i)=>(
                      <TableCell key={i} align="right">{getSelectedOption(ques._id, i,j)}</TableCell>
                    ))}
                      
                    </TableRow>
                  ))}
                </TableBody>
                
              </Table>
            </TableContainer>
        <Doughnut
          data={state}
          options={{
            title:{
              display:true,
              text:'Average Rainfall per month',
              fontSize:10
            },
            legend:{
              display:true,
              position:'right'
            },
            maintainAspectRatio: true,
            // circumference: 10,
            borderRadius:3,
            radius: 50
          }}
        />
      </div>
  );
}
export default AnalysisTab
