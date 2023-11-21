const {request, response} = require('express');
const bcrypt = require('bcrypt');
const demonModel = require('../models/demon');
const pool = require('../db');

const listDemon = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const demon = await conn.query(demonModel.getAll, (err) =>{
            if(err){
                throw err;
            }

        })
        res.json(demon);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);     
    }finally{
        if(conn){
            conn.end();
        }
    }
}

const listdemonByID = async (req = request, res = response) =>{
    const {id} = req.params;
    let conn;

    if(isNaN(id)){
        res.status(400).json({msg: `The ID ${id} is invalid`});
        return;
    }

    try {
        conn = await pool.getConnection();

        const [demon] = await conn.query(demonModel.getByID, [id], (err) => {
            if(err){
                throw err;
            }
        })

        if(!demon){
            res.status(404).json({msg: `Demon  with ID ${id} not found`});
            return;
        }
        res.json(demon);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn){
            conn.end();
        }
    }
}

const addDemon =async (req = request, res = response) => {
    const {
        password,
        CharacterName,
        Race,
        Gender,
        Age,
        Category,
        Affiliation,
        Alias,
        Abilities,
        BreathingStyle,
        FightingStyle,
        DemonArt,
        Equipment,
        Fights,
        is_active = 1
    }= req.body

    if(!password || !CharacterName || !Race || !Gender || !Age || !Category || !Affiliation || !Alias || !Abilities
        || !BreathingStyle || !FightingStyle || !DemonArt || !Equipment ||!Fights){
        res.status(400).json({msg: 'Missing iformation'});
        return;

    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const demon = [passwordHash, CharacterName, Race, Gender, Age, Category, Affiliation, Alias, Abilities, BreathingStyle, FightingStyle,
        DemonArt, Equipment, Fights, is_active]
    let conn;

    try {
        conn = await pool.getConnection();

        const [usernameExist] = await conn.query(demonModel.getByUsername, [CharacterName], (err) => {
            if(err) throw err;
        })
        if (usernameExist){
            res.status(409).json({msg: `The Character ${CharacterName} already exists`});
            return;
        }

        const demonAdd = await conn.query(demonModel.addRow, [...demon], (err) =>{
            if(err) throw err;
        })
        if(demonAdd.affectedRows === 0){
            throw new Error('Character not added');
        }
        res.json({msg: 'Character added succesfully'});

        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}

const updateDemon = async (req = request, res = response) =>{
    let conn;

    const{
        password,
        CharacterName,
        Race,
        Gender,
        Age,
        Category,
        Affiliation,
        Alias,
        Abilities,
        BreathingStyle,
        FightingStyle,
        DemonArt,
        Equipment,
        Fights,
        is_active

    } = req.body;

    const {id} =req.params;

    let passwordHash;
    if(password){
        const saltRounds = 10;
        passwordHash = await bcrypt.hash(password, saltRounds);
    }

    let demonNewData = [
        passwordHash,
        CharacterName,
        Race,
        Gender,
        Age,
        Category,
        Affiliation,
        Alias,
        Abilities,
        BreathingStyle,
        FightingStyle,
        DemonArt,
        Equipment,
        Fights,
        is_active
    ];
    
    try{
        conn = await pool.getConnection();

        const [demonExists] = await conn.query(demonModel.getByID, [id], (err) =>{
            if(err) throw err;
        }
        );
        if(!demonExists || demonExists.is_active === 0){
            res.status(400).json({msg: `Character with ID ${id} not found`});
            return
        }
        const [usernameExist] = await conn.query(demonModel.getByUsername, [CharacterName], (err) => {
            if(err) throw err;
        })
        if (usernameExist){
            res.status(409).json({msg: `Character ${CharacterName} already exists`});
            return;
        }

        const demonOldData = [
            demonExists.password,
            CharacterName,
            demonExists.Race,
            demonExists.Gender,
            demonExists.Age,
            demonExists.Category,
            demonExists.Affiliation,
            demonExists.Alias,
            demonExists.Abilities,
            demonExists.BreathingStyle,
            demonExists.FightingStyle,
            demonExists.DemonArt,
            demonExists.Equipment,
            demonExists.Fights,
            demonExists.is_active,
        ];

        demonNewData.forEach((demonData, index) =>{
            if(!demonData){
                demonNewData[index] = demonOldData[index];
            }
        })
        const demonUpdated = await conn.query(
            demonModel.updateRow,[...demonNewData, id],
            (err) => {
                if (err) throw err;
            }
        )
        if (demonUpdated.affectedRows === 0){
            throw new Error('Character not updated');
        }
        res.json({msg: 'Character updated succesfully'});
    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn) conn.end();
    }
}

const deleteDemon = async (req = request, res = response)=>{
    let conn;
    const {id} = req.params;

    try {
        conn = await pool.getConnection();

        const [demonExists] = await conn.query(demonModel.getByID, [id], (err) =>{
            if(err) throw err;
        }
        );
        if(!demonExists || demonExists.is_active === 0){
            res.status(400).json({msg: `Character with ID ${id} not found`});
            return
        }
        const demonDeleted = await conn.query(
            demonModel.deleteRow, [id], (err) =>{
                if(err) throw err;
            }
        );
        if(demonDeleted.affectedRows === 0){
            throw new Error('Character not deleted');
        }
        res.json({msg: 'Character deleted succesfully'});

    } catch (error) {
        console.log(error);
        res.status(500).json(error);  
    }finally{
        if(conn) conn.end();
    }
}

const signInUser = async (req = request, res = response) =>{
    let conn;

    const {CharacterName, password} = req.body;

    try{
        conn = await pool.getConnection();

        if(!CharacterName || !password){
            res.status(400).json({msg: 'You must send Character and password'});
            return;
        }

        const [demon] = await conn.query(demonModel.getByUsername,
            [CharacterName],
            (err) =>{
                if(err)throw err;
            }
            );
            if (!demon){
                res.status(400).json({msg: `Wrong Character or password`});
                return;
            }

            const passwordOK = await bcrypt.compare(password, demon.password);

            if(!passwordOK){
                res.status(404).json({msg: `Wrong Character or password`});
                return;
            }

            delete(demon.password);

            res.json(demon);
    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn) conn.end();
    }
}



module.exports = {listDemon, listdemonByID, addDemon, updateDemon, deleteDemon, signInUser}