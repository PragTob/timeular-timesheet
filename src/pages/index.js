import React, { useState } from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

import { makeStyles } from '@material-ui/core/styles'

import { Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const IndexPage = () => {

  const classes = useStyles()

  // Moving to timeular API module

  const BASE_TIMEULAR_API_URL = "https://api.timeular.com/api/v2"

  const fetchActivites = async (token) => {
    console.log("feetching activities");
    const response = await fetch(`${BASE_TIMEULAR_API_URL}/activities`, {
      headers: apiHeaders(token),
      method: "GET"
    });
    console.log("waiting for activities json");
    const json = await response.json();
    console.log("Activities JSON");
    console.log(json);
    const { activities } = json;

    return activities;
  }

  const apiHeaders = (token) => {
    return {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  }

  const getAccessToken = async (key, secret) => {
    const data = {
      apiKey: key,
      apiSecret: secret
    };
    console.log("doing access token request");
    const response = await fetch(`${BASE_TIMEULAR_API_URL}/developer/sign-in`, {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
      method: "POST"
    });
    console.log("waiting for json");
    const json = await response.json();
    console.log("Token JSON");
    console.log(json);
    const { token } = json;
    console.log(token);

    return token;
  }

  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  const [accessToken, setAccessToken] = useState(null);
  const [activities, setActivities] = useState(null);

  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleActivityChecked = (event, id) => {
    console.log(selectedActivities);
    if (event.target.checked) {
      setSelectedActivities(
        selectedActivities => [...selectedActivities, id]
      )
    }
    else {
      setSelectedActivities(
        selectedActivities.filter((someId) => { return someId !== id; }));
    }
    console.log(selectedActivities)
  }


  // should handleSubmit be async and call out to await? Probably not, we'd likely need a load state
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting");
    //  where to store/get access token from?
    if (!accessToken) {
      // await?
      setAccessToken(await getAccessToken(apiKey, apiSecret));
      console.log(`access Token inside ${accessToken}`);
    }

    console.log(`access Token ${accessToken}`);


    accessToken || setAccessToken(await getAccessToken(apiKey, apiSecret));
    activities || setActivities(await fetchActivites(accessToken));
  }

  return (
    <Layout>
      <SEO title="Home" />
      <p>
        Get your time sheet from your <a href="https://timeular.com/">Timeular</a> time tracking.
      </p>

      <p>
        Useful for invoicing or others.
      </p>

      <p>Blablablabla how to get your API key etc. blablablabalabla we have full access now</p>

      {/* TODO: WHat does classes.root do? */}
      <form className={classes.root} noValidate onSubmit={handleSubmit} >
        <div>
          <TextField label="API Key" variant="outlined" value={apiKey} onChange={e => setApiKey(e.target.value)} />
          <TextField label="API Secret" variant="outlined" value={apiSecret} onChange={e => setApiSecret(e.target.value)} />
        </div>

        {/* Time from time until */}

        {/* activity component */}
        {console.log(activities)}
        <div>
          {(activities || []).map(({ id, name, color }) => {
            const myStyle = { color: color };
            console.log(myStyle);
            return <FormControlLabel
              key={id}
              control={
                <Checkbox style={myStyle} />
              }
              label={name}
              onChange={e => handleActivityChecked(e, id)}
            />;
          })}
        </div>

        {/* Restrict to activity */}

        <Button variant="contained" color="primary" type="submit">Fetch Activities</Button>
      </form>

      {/* generate report */}

      {/* print report */}

    </Layout >
  )
}

export default IndexPage
