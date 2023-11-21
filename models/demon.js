const demonModel = {
    getAll:`
        SELECT
              *
        FROM
             demon
       `,
       getByID:`
          SELECT
                *
            FROM
                 demon
            WHERE
                id=?
      `,
      getByUsername:`
                   SELECT
                        *
                   FROM
                          demon
                  WHERE
                        CharacterName = ?

                       `,
                       addRow:`
            INSERT INTO
                demon(
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

                    )VALUES(                                                                                                                                                 
                         ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
                    )
                 `,
                 updateRow:`
                      UPDATE
                           demon
                        SET
                        password = ?,
                        CharacterName = ?,
                        Race = ?,
                        Gender = ?,
                        Age = ?,
                        Category = ?,
                        Affiliation = ?,
                        Alias = ?,
                        Abilities = ?,
                        BreathingStyle = ?,
                        FightingStyle = ?,
                        DemonArt = ?,
                        Equipment = ?,
                        Fights = ?,
                        is_active =?
                  WHERE
                       id = ?
                 `,
                 deleteRow:`
                      UPDATE
                        demon
                      SET 
                          is_active = 0
                      WHERE
                           id = ?
                           `,

}

module.exports = demonModel;