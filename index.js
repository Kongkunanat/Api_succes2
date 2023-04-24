const express = require('express')
const app = express();
const mysql = require('mysql2');
require('dotenv').config()
const cors = require('cors');
const multer = require('multer')
var path = require('path');
const BodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
app.use(cors());
app.use(express.json());


app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }))
//asdasd

app.use(express.static(path.join(__dirname, 'public')));


const db = mysql.createConnection(
    process.env.DATABASE_URL
)


  app.use(express.json());
  app.use(cors());
  

  

  
    app.post("/login", (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
    
        db.query("SELECT * FROM admin WHERE username = ?", [username], (err, result) => {
          if (err) {
            res.send(err);
          }
          if (result.length > 0) {
            
            if(password == result[0].password){
                res.send(result[0])
            }
            else{
                res.send({ msg: "username or Password incorrect" });
            }
            
          } else {
            res.send({ msg: "No user account" });
          }
        });
      });

db.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
})


 




//ADMIN
// get information admin
app.get('/getadmin',(req, res)=>{
    db.query(`SELECT * FROM admin`,(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    });
});

// insert data
app.post('/insertadmin',(req, res)=>{

      let username = req.body.username;
      let password = req.body.password;
      console.log(username)
      let sql = "INSERT INTO admin(username,password) VALUES(?,?)";
      db.query(sql,[username,password],(err, result)=>{
          if(err){
              console.log(err);
          }
          else{
             // res.send(result);
             res.send("Values Inserted");
          }
      });
  });


// update data
app.put('/updateadmin',(req, res)=>{
    let id = req.body.id;
    let username = req.body.username;
    let password = req.body.password;


    let sql = "UPDATE admin SET username=?,password=? WHERE id=?"; 
    db.query(sql,[username,password,id],(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.write('Update.......');
            res.end();
        }
    });
});





// delete data
app.delete('/deleteadmin/:id',(req, res)=>{
        let id = req.params.id;
        let sql = "DELETE FROM admin WHERE id = ?";
        console.log(id);
        db.query(sql, [id],(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    });
});




















//category

// get information category
app.get('/getcategory',(req, res)=>{
    db.query(`SELECT * FROM category`,(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    })
})


// update data
app.put('/updatecate',(req, res)=>{
    let id = req.body.id;
    let title = req.body.title;

    console.log(id);


    let sql = "UPDATE category SET cat_title=?  WHERE cat_id=?"; 
    db.query(sql,[title,id],(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.write('Update.......');
            res.end();
        }
    });
});



// insert data
app.post('/insertcategory',(req, res)=>{
  
      let title = req.body.title;
      
  
      let sql = 'INSERT INTO category(cat_title) VALUES(?)';
      db.query(sql,[title],(err, result)=>{
          if(err){
              console.log(err);
          }
          else{
            res.send("Values Inserted");
          }
      })
  })

















//habit

// get information habit
app.get('/gethabit',(req, res)=>{
    db.query(`SELECT * FROM habit`,(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    })
})

// insert habit
app.post('/inserthabit',(req, res)=>{

    let title = req.body.title;

      let sql = 'INSERT INTO habit(habit_title) VALUES(?)';
      db.query(sql,[title],(err, result)=>{
          if(err){
              console.log(err);
          }
          else{
             // res.send(result);
              res.write('sdfdsf...');
              res.end();
          }
      })
  })


// update habit
app.put('/updatehabit',(req, res)=>{
    let id = req.body.id;
    let title = req.body.title;
    let sql = 'UPDATE habit SET habit_title =? WHERE habit_id=?'; 
    db.query(sql,[title,id],(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
           // res.send(result);
            res.write('Update.......');
            res.end();
        }
    })
})





















//FOREST

var imgconfig = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null,file.originalname)  
    }
})


// img filter
const isImage = (req,file,callback)=>{
    if(file.mimetype.startsWith("image")){
        callback(null,true)
    }else{
        callback(null,Error("only image is allowd"))
    }
}

var upload = multer({
    storage:imgconfig,  fileFilter:isImage, limits: { fileSize: 1024 * 1024 }
});



// insert data
app.post('/insertdata',upload.single('image'),(req, res)=>{

    let catid = req.body.catid;
    let title = req.body.title;
    let sciname = req.body.sciname;
    let Common = req.body.Common;
    let image = req.file;
    const imageName = image.originalname;
    let habit = req.body.habit;
    let desc = req.body.desc;
    let benefit = req.body.benefit;  

    let sql = 'INSERT INTO forest(cat_id, forest_title, forest_sciname, forest_Common, forest_image, forest_desc, forest_benefit,habit_id) VALUES(?,?,?,?,?,?,?,?)';
    db.query(sql,[catid,title,sciname,Common,imageName,desc,benefit,habit],(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.write('sdfdsf...');
            res.end();
        }
    })
})



app.get('/getdata',(req, res)=>{
        db.query(`SELECT forest_id,forest_sciname,forest_Common,forest_title ,habit_id,cat_title ,forest_image ,forest_desc,forest_benefit, forest.cat_id FROM forest, category WHERE  forest.cat_id = category.cat_id`,(err, result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.send(result);
            }
        })

    })


//get mushroom
app.get('/getmushroom',(req, res)=>{
    db.query(`SELECT * FROM forest  INNER JOIN habit ON (forest.habit_id=habit.habit_id) WHERE   forest_id = 13`,(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    })

})


app.get('/getmushroom2',(req, res)=>{
    db.query(`SELECT * FROM forest  INNER JOIN habit ON (forest.habit_id=habit.habit_id) WHERE  forest_id = 12`,(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    })

})


app.get('/getmushroom3',(req, res)=>{
    db.query(`SELECT * FROM forest  INNER JOIN habit ON (forest.habit_id=habit.habit_id) WHERE  forest_id = 14`,(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    })

})

	




app.get('/getmushroom_cat3',(req, res)=>{
    db.query(`SELECT * FROM forest  INNER JOIN habit ON (forest.habit_id=habit.habit_id) WHERE cat_id = 3`,(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    })
})




app.get('/getherb',(req, res)=>{
    db.query(`SELECT * FROM forest  INNER JOIN habit ON (forest.habit_id=habit.habit_id) WHERE cat_id = 1`,(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    })

})


app.get('/getforest',(req, res)=>{
    db.query(`SELECT * FROM forest  INNER JOIN habit ON (forest.habit_id=habit.habit_id) WHERE cat_id = 2`,(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    })

})
// update data
app.put('/updatedata/:id',upload.single('avatar'),(req, res)=>{
    let id = req.params.id;
    let newcatid = req.body.newcatid;
    let newtitle = req.body.newtitle;
    let newsciname = req.body.newsciname;
    let newCommon = req.body.newCommon;
    let image = req.file;
    const imageName2 = image.originalname;
    let newhabit = req.body.newhabit;
    let newdesc = req.body.newdesc;
    let newbenefit = req.body.newbenefit;
    console.log(id)

    let sql = `UPDATE forest SET cat_id=?, forest_title=?, forest_sciname=?, forest_Common=?, forest_image=?, forest_desc=?, forest_benefit=?,habit_id=? WHERE forest_id=?`; 
    db.query(sql,[newcatid,newtitle,newsciname,newCommon,imageName2,newdesc,newbenefit,newhabit,id],(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
           // res.send(result);
            res.write('Update.......');
            res.end();
        }
    })
})






// delete data
app.delete('/deletedata/:id',(req, res)=>{
        let id = req.params.id;
        let sql = 'Delete from forest Where forest_id = ? ';
        console.log(id);
        db.query(sql, [id],(err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    })
})


const PORT = process.env.PORT || 3003
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))


