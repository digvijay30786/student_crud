import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button,Table,Dropdown,DropdownButton,Modal,Form } from 'react-bootstrap';
import { useState,useEffect } from 'react';
import { useHistory,Switch,Route, } from 'react-router-dom';
import axios from 'axios';
function App() {
  let history =  useHistory();
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState(false);
  const [details,setDetails] = useState({});
  const [loading,setLoading] = useState(false);
  const [data,setData] = useState(null);
  const [update,setUpdate] = useState(false);
  const [filterage,setFilterAge] = useState(null);
  const [filtergender,setFilterGender] = useState(null);
  const [filtercity,setFilterCity] = useState(null);
  const [pagecount, setPageCount] = useState([]);
  const [edit,setEdit]=useState(null);
  //save value in a object 

  const handlevalue = (e) => 
  {
    const {name,value} = e.target;
    setDetails({...details,[name]:value});
  }

  //save student data in databases using this funtion
  const handleFormDetails = (e) => {
    e.preventDefault();
    axios({
      method: 'post',
      url: 'http://localhost:2400/student',
      headers: {
          'Content-Type': 'application/json'
      },
      data: JSON.stringify(details)
  }).then(({ data }) => {
      setShow(false);
      setUpdate(!update);
  }).catch((err) => {
      alert(err);
  });
   }

   const getData = () => {

     let url = "http://localhost:2400/student";
    if(window.location.search)
    {
      url+=window.location.search
    }
    axios(
      {
        method:"get",
        url:url,
      }).then(({data})=> {
        
        var row = [];
        for(var i = 0;i<data.pageCount;i++)
        {
           row.push(i+1);
        }
        setPageCount(row);
        setData(data.getStudentDetails);
        setLoading(true);
      }).catch((err)=>{
           alert(err);
      });

   }


   const handleUpdatedetails = (e) => {

    e.preventDefault();
    axios(
      {
        method:"patch",
        url:`http://localhost:2400/student/${edit._id}`,
        headers: {
          'Content-Type': 'application/json'
      },
        data:JSON.stringify(details)
      }).then(({data})=> {
          setEdit(null);
          setDetails({});
          setUpdate(!update);
          setShow(false);
      }).catch((err)=>{
           alert(err);
      });

   }

   const handleDelete = (id)=>{
     axios.delete(`http://localhost:2400/student/${id}`).then(()=>{
          setUpdate(!update);
     }).catch((err)=>{
         console.log(err);
     })
   }


   const handleUpdate = (id) => {
  axios.get(`http://localhost:2400/student/${id}`).then(({data})=>{
      console.log(data);
      setEdit(data.studentDetails);
       setShow(true);
 }).catch((err)=>{
     console.log(err);
 })
   }


   const handlefilter = (e) => 
   {
     let url='/?';
     if(filterage)
     {
       url+=`&age=${filterage}`;
     }
     if(filtergender)
     {
      url+=`&gender=${filtergender}`;
     }
     if(filtercity)
     {
      url+=`&city=${filtercity}`;
     }
     
     history.push(url);
     setUpdate(!update);
     setFilter(false);
     e.preventDefault();
   } 


   useEffect(()=>{
    getData();
   },[update]);

  return (
    <Switch>
    <Route exact path=''>
    <div className="App">

       {/* model call for student details */}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>

          <Modal.Title id="example-custom-modal-styling-title">
            Student Details Form
          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

            <div>

              <Form onSubmit={ edit?handleUpdatedetails:handleFormDetails}>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter Your Full Name" name="name" defaultValue={edit?edit.name:''} onChange={handlevalue}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Age </Form.Label>
                  <Form.Control type="Number" placeholder="Enter Your Age" name="age" defaultValue={edit?edit.age:''} onChange={handlevalue} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Label> Gender </Form.Label>
                 <Form.Select name="gender" onChange={handlevalue}>
                   <option>--Select Gender--</option>
                   <option value="male" selected={edit && edit.gender==='male'?'selected':''}>Male</option>
                   <option value="Female">FeMale</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Label> City </Form.Label>
                <Form.Control type="text" placeholder="Enter Your city" name="city" defaultValue={edit ? edit.city:''} onChange={handlevalue} />
                </Form.Group>

                <Button variant="primary" type="submit">
                  {edit?'Update':'Submit'}
                </Button>

            </Form>

            </div>

        </Modal.Body>
      </Modal>

       {/* end student model */}


        {/* model call for filter */}

      <Modal
        show={filter}
        onHide={() => setFilter(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>

          <Modal.Title id="example-custom-modal-styling-title">
            Filter
          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

            <div>
              
              <Form onSubmit={handlefilter}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Age </Form.Label>
                  <Form.Control type="Number" placeholder="Enter Your Age" name="age" onChange={(e)=>{ setFilterAge(e.target.value)}} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                
                <Form.Label> Gender </Form.Label>
                 <Form.Select onChange={(e)=>{ setFilterGender(e.target.value)}}>
                   <option>--Select Gender--</option>
                   <option value="male">Male</option>
                   <option value="Female">FeMale</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                
                <Form.Label> City </Form.Label>
                <Form.Control type="text" placeholder="Enter Your city" onChange={(e)=>{ setFilterCity(e.target.value)}} name="city"/>
                </Form.Group>

                <Button variant="primary" type="submit">
                  Filter
                </Button>

            </Form>

            </div>

        </Modal.Body>
      </Modal>

       {/* end filter model */}

  <Table striped bordered hover>
  <thead>
    <tr>
      <th>S.No.</th>
      <th>Name</th>
      <th>Age</th>
      <th>Gender</th>
      <th>City</th>
    </tr>
  </thead>
  <tbody>
  { loading &&

    data.map((item,i) => {
     
      return <tr>
      <td>{i+1}</td>
      <td>{item.name}</td>
      <td>{item.target}</td>
      <td>{item.age}</td>
      <td>{item.city}</td>
      <td><Button variant="primary" onClick={()=>{handleUpdate(item._id)}}>Edit</Button></td>
      <td><Button variant="danger" onClick={()=>{handleDelete(item._id)}}>Delete</Button></td>
    </tr>

    })
  }
  {
    !loading && <p>Loading...</p>
  }
  </tbody>
</Table>


    <div className="resize">
          <div>
              <DropdownButton id="dropdown-item-button" title="Sort Data">
                <Dropdown.Item as="button">Low to High</Dropdown.Item>
                <Dropdown.Item as="button">High to low</Dropdown.Item>
                <Dropdown.Item as="button">default</Dropdown.Item>
              </DropdownButton>
        </div>

          <div>
              <Button variant="primary" onClick={() => setFilter(true)}>
                Filter Data
              </Button>
          </div>

          <div>
              <Button variant="success" onClick={() => setShow(true)}>
              Add New Student
              </Button>
          </div>
    </div>
    
<div>
         {
           pagecount.map((item) => {
              return <button onClick={()=>{ history.push(`${window.location.search.page && window.location.search ?window.location.search+'&'+'page='+item:'?'+'page='+item}`);setUpdate(!update)}}>{item}</button>
           })
         }
</div>     
</div>
</Route>
</Switch>

  );
}

export default App;
