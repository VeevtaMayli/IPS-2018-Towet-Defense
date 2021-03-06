<?php
function getFieldByKnownField($knownField, $field)
{
    $query = "SELECT " . $field . " FROM " . USER_TABLE .  " WHERE name = '" . dbQuote($knownField)  . "';";
    return dbQueryGetResult($query);
}

function registerUser($name, $pass)
{
    $query = "INSERT INTO " . USER_TABLE . " (name, password, registration_date)
    VALUES ('" . dbQuote($name) . "', '" . dbQuote($pass) . "', '" . dbQuote(date("Y-m-d")) . "');";
    dbQuery($query);
    return dbGetLastInsertId();
}

function getPasswordHashByName($name)
{
    $query = "SELECT password FROM " . USER_TABLE .  " WHERE name = '" . dbQuote($name)  . "';";
    return dbQueryGetResult($query);
}

function checkPassword($name, $password)
{
    $validHash = getPasswordHashByName($name)[0]["password"];
    return password_verify($password, $validHash);
}

function changeName($curName, $newName)
{
    $id = getFieldByKnownField($curName, 'user_id');
    $query = "UPDATE " . USER_TABLE . " SET name = '" .  dbQuote($newName) . "' WHERE user_id = '" . $id[0]["user_id"]  . "';";
    dbQuery($query);
    return dbGetLastInsertId();
}

function changePassword($name, $password)
{
    $id = getFieldByKnownField($name, 'user_id');
    $query = "UPDATE " . USER_TABLE . " SET password = '" .  dbQuote($password) . "' WHERE user_id = '" . $id[0]["user_id"]  . "'";
    dbQuery($query);
    return dbGetLastInsertId();
}
