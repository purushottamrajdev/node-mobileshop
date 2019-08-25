const request=require('supertest');
const {Mobile}=require('../../models/mobile');
const {User}=require('../../models/user');
const mongoose=require('mongoose');
let server;
let token;
        let company,model,screenSize,price,cameraSpecification,ram,isDiscountAvailable,imageUrl;
        
describe('/api/mobile',()=>{
   
    const insertMany=async()=>{
        await Mobile.collection.insertMany([
            {
                company: 'appo',
                model: 'a67',
                screenSize: 6.5,
                price: 13000,
                cameraSpecification: '15 megapixel',
                ram: 3,
                isDiscountAvailable: false,
                imageUrl: 'https://www.google.com'
              }               
            ]
            );
    }

    beforeEach(()=>{
        company='appo'; 
        model='a64';
        screenSize=6;
        price=15000;
        cameraSpecification='20 megapixel';
        ram=5;
        isDiscountAvailable=true;
        imageUrl= 'https://www.google.com';  
        token=new User().generateAuthToken();
        server=require('../../index');
    })
    afterEach(async()=>{
        await Mobile.remove({});
        server.close();});
        
        
        const execPost=async()=>{
            return await request(server)
            .post('/api/mobile')
            .set('x-auth-token',token)
            .send({company,model,screenSize,price,cameraSpecification,ram,isDiscountAvailable,imageUrl})//if key and value name are same then in es 6 ,we can use only keynames
        }
        // /api/mobile endpoint testing
    describe('GET /',()=>{
       
        it('should return 401 if no token provided',async()=>{
           token='';
            await insertMany();
            const res= await request(server).get('/api/mobile');
            expect(res.status).toBe(401);
        })
        it('should return all product if valid token provided',async()=>{
            await insertMany();
            const res= await request(server).get('/api/mobile').set('x-auth-token',token);
            expect(res.status).toBe(200);
            expect(res.body.some(g=>g.company==='appo')).toBeTruthy();
        })

        it('should return 400 if invalid token provided',async()=>{
            token='1234';
            await insertMany();
            const res= await request(server).get('/api/mobile').set('x-auth-token',token);
            expect(res.status).toBe(400);
        })
    })

    describe('GET /:id',()=>{
        it('should return a product if valid id and token is passed',async()=>{
            const mobile=new Mobile({ 
            company: 'appo',
            model: 'a67',
            screenSize: 6.5,
            price: 13000,
            cameraSpecification: '15 megapixel',
            ram: 3,
            isDiscountAvailable: false,
            imageUrl: 'https://www.google.com'});
            await mobile.save(); 
            const res=await request(server).get('/api/mobile/'+mobile._id).set('x-auth-token',token);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('company',mobile.company);
        })

        it('should return 401 if no token provided',async()=>{
            const mobile=new Mobile({ 
            company: 'appo',
            model: 'a67',
            screenSize: 6.5,
            price: 13000,
            cameraSpecification: '15 megapixel',
            ram: 3,
            isDiscountAvailable: false,
            imageUrl: 'https://www.google.com'});
            await mobile.save(); 
            const res=await request(server).get('/api/mobile/'+mobile._id)
            expect(res.status).toBe(401);
        })

        it('should return 400 if invalid token provided',async()=>{
            token='1234';
            const mobile=new Mobile({ 
            company: 'appo',
            model: 'a67',
            screenSize: 6.5,
            price: 13000,
            cameraSpecification: '15 megapixel',
            ram: 3,
            isDiscountAvailable: false,
            imageUrl: 'https://www.google.com'});
            await mobile.save(); 
            const res=await request(server).get('/api/mobile/'+mobile._id).set('x-auth-token',token);
            expect(res.status).toBe(400);
        })
    })

    describe('POST /',()=>{
       
        it('should return 401 if no token provided',async()=>{
            token='';
            const res=await execPost();
            expect(res.status).toBe(401);
        })
        it('should return 400 if invalid token provided',async()=>{
            token='1234';
            const res=await execPost();
            expect(res.status).toBe(400);
        })

        it('should return 403 if unauthorized user token provided',async()=>{
            const res=await execPost();
            expect(res.status).toBe(403); 
        })

        it('should return a posted product if authorized user token provided',async()=>{
            const user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true};
            token= new User(user).generateAuthToken();
            const res=await execPost();
            expect(res.status).toBe(200); 
            expect(res.body).toHaveProperty('company',company);
        })
        it('should return 400 is invalid data provided',async()=>{
           company='a';
           price=-100; 
            const user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true};
            token= new User(user).generateAuthToken();
            const res=await execPost();
            expect(res.status).toBe(400); 
        })
    })

    describe('PUT /',()=>{
        const execPut=async(id)=>{
            return await request(server)
            .put('/api/mobile/'+id)
            .set('x-auth-token',token)
            .send({company,model,screenSize,price,cameraSpecification,ram,isDiscountAvailable,imageUrl})//if key and value name are same then in es 6 ,we can use only keynames
        }

        it('should return 401 if no token provided',async()=>{
            const user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true};
            token= new User(user).generateAuthToken();
            let res=await execPost();
            token='';
            res=await execPut(res.body._id);
            expect(res.status).toBe(401);
        })

        it('should return 400 if invalid token provided',async()=>{
            const user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true};
            token= new User(user).generateAuthToken();
            let res=await execPost();
            token='1234';
            res=await execPut(res.body._id);
            expect(res.status).toBe(400);
        })

        it('should return 403 if unauthorized user token provided',async()=>{
            let user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true};
            token= new User(user).generateAuthToken();
            let res=await execPost();
             user={_id:mongoose.Types.ObjectId().toHexString()};
            token= new User(user).generateAuthToken();
            res=await execPut(res.body._id);
            expect(res.status).toBe(403);
        })

        it('should return 400 if invalid data provided',async()=>{
            const user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true};
            token= new User(user).generateAuthToken();
            let res=await execPost();
            company='a';
            price=-100; 
            res=await execPut(res.body._id);
            expect(res.status).toBe(400);
        })

        it('should return 404 if invalid id provided',async()=>{
            const user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true};
            token= new User(user).generateAuthToken();
            let res=await execPost();
            res=await execPut(1);
            expect(res.status).toBe(404);
        })

        it('should return 400 if invalid data provided',async()=>{
            const user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true};
            token= new User(user).generateAuthToken();
            let res=await execPost();
            company='a';
            price=-100;
            res=await execPut(res.body._id);
            expect(res.status).toBe(400);
        })

        it('should return updated object if valid id provided',async()=>{
            const user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true};
            token= new User(user).generateAuthToken();
            let res=await execPost();
            res=await execPut(res.body._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('company',company);
        })
    })

    describe('DELETE /:id',()=>{
        const execDelete=async(id)=>{
            return await request(server)
            .delete('/api/mobile/'+id)
            .set('x-auth-token',token)
        }  
        it('should return 401 if no token provided',async()=>{
            const user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true,isSuperAdmin:true};
            token= new User(user).generateAuthToken();
            let res=await execPost();
            token='';
            res=await execDelete(res.body._id);
            expect(res.status).toBe(401);
        })

        it('should return 400 if invalid token provided',async()=>{
            const user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true,isSuperAdmin:true};
            token= new User(user).generateAuthToken();
            let res=await execPost();
            token='1234';
            res=await execDelete(res.body._id);
            expect(res.status).toBe(400);
        })

        it('should return 403 if unauthorized user token provided',async()=>{
            const user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true};
            token= new User(user).generateAuthToken();
            let res=await execPost();
            res=await execDelete(res.body._id);
            expect(res.status).toBe(403);
        })

        it('should return deleted object',async()=>{
            const user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true,isSuperAdmin:true};
            token= new User(user).generateAuthToken();
            let res=await execPost();
            res=await execDelete(res.body._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('price',price);
        })
    })

})
