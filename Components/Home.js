import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import Box from "@mui/material/Box";
import {
  contract_address,
  contract_abi,
  buy_price,
  speedy_nodes,
} from "../config";
import detectEthereumProvider from "@metamask/detect-provider";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
//import {useMediaQuery} from "react-responsive";
//import Fade from "react-reveal/Fade";

export default function Home() {
  useEffect(() => {
    connect_wallet();
    fetch_data();
  }, []);
  const [mintNumber, setMintNumber] = useState(1);
  const [mintingcount, setmintingcount] = useState(1);
  const [totalsupply, settotalsupply] = useState(0);
  const [price, set_price] = useState(0);
  // const [total, set_total] = useState(0.2);
  // set_total(mintNumber*price);
  let total = mintNumber * price + 0.000000000000001;

  // const onMintNumberChange = (e) => {
  //   setMintNumber(+e.target.value);
  // }

  const mintButtonClickHandler = () => {
    sale_controller();
  };
  const [walletstatus, set_walletstatus] = useState("Connect Wallet");

  async function connect_wallet() {
    if (Web3.givenProvider) {
      const providerOptions = {
        /* See Provider Options Section */
      };

      const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions, // required
      });

      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);

      web3.eth.net.getId().then((result) => {
        console.log("Network id: " + result);
        if (result !== 1) {
          alert("Wrong Network Selected. Select Ethemerun mainnet");
        }
      });
      set_walletstatus("Wallet Connected");
    } else {
      // alert("Web3 Not Found");
    }
  }

  async function fetch_supply() {
    const web3 = new Web3(speedy_nodes);
    const contract = new web3.eth.Contract(contract_abi, contract_address);
    //await Web3.givenProvider.enable()

    contract.methods.totalSupply().call((err, result) => {
      console.log("error: " + err);
      if (result != null) {
        settotalsupply(result);
      }
    });
  }

  async function fetch_data() {
    const web3 = new Web3(speedy_nodes);
    const contract = new web3.eth.Contract(contract_abi, contract_address);
    //await Web3.givenProvider.enable()

    contract.methods.Presale_status().call((err, result) => {
      console.log("error: " + err);
      if (result === true) {
        set_price(10);
      } else {
        set_price(10);
      }
    });
  }

  async function show_error_alert(error) {
    let temp_error = error.message.toString();
    console.log(temp_error);
    let error_list = [
      "It's not time yet",
      "Sent Amount Wrong",
      "Max Supply Reached",
      "You have already Claimed Free Nft.",
      "Presale have not started yet.",
      "You are not in Presale List",
      "Presale Ended.",
      "You are not Whitelisted.",
      "Sent Amount Not Enough",
      "Max 20 Allowed.",
      "insufficient funds",
      "Sale is Paused.",
      "mint at least one token",
      "max per transaction 20",
      "Not enough tokens left",
      "incorrect ether amount",
      "5 tokens per wallet allowed in presale",
      "10 tokens per wallet allowed in publicsale",
      "Invalid merkle proof",
      "Not enough tokens allowed in current phase",
      "Sold Out",
      "No more tokens left in current phase",
    ];

    for (let i = 0; i < error_list.length; i++) {
      if (temp_error.includes(error_list[i])) {
        // set ("Transcation Failed")
        alert(error_list[i]);
      }
    }
  }
  function sale_controller() {
    const web3 = new Web3(speedy_nodes);
    const contract = new web3.eth.Contract(contract_abi, contract_address);
    //await Web3.givenProvider.enable()
    console.log("error: i am in fetch ");
    contract.methods.Presale_status().call((err, result) => {
      console.log("error: " + err);
      console.log(result);
      if (result === true) {
        presalemint_nft();
      } else {
        mint_nft();
      }
    });
  }

  async function presalemint_nft() {
    if (Web3.givenProvider) {
      const web3 = new Web3(Web3.givenProvider);
      await Web3.givenProvider.enable();
      const contract = new web3.eth.Contract(contract_abi, contract_address);
      const addresses = await web3.eth.getAccounts();
      const address = addresses[0];
      console.log("addresses[0]: " + addresses[0]);
      // console.log("addresses[1]: "+addresses[1])
      // console.log("Default address: "+await web3.eth.defaultAccount)
      try {
        const estemated_Gas = await contract.methods
          .buy_presale(mintNumber)
          .estimateGas({
            from: address,
            value: web3.utils.toWei(total.toString(), "ether"),
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
          });
        console.log(estemated_Gas);

        const result = await contract.methods.buy_presale(mintNumber).send({
          from: address,
          value: web3.utils.toWei(total.toString(), "ether"),
          gas: estemated_Gas,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null,
        });
      } catch (error) {
        show_error_alert(error);
      }

      //await contract.methods.tokenByIndex(i).call();
    }
  }
  async function mint_nft() {
    if (Web3.givenProvider) {
      const web3 = new Web3(Web3.givenProvider);
      await Web3.givenProvider.enable();
      const contract = new web3.eth.Contract(contract_abi, contract_address);

      const addresses = await web3.eth.getAccounts();
      const address = addresses[0];
      console.log("addresses[0]: " + addresses[0]);
      // console.log("addresses[1]: "+addresses[1])
      // console.log("Default address: "+await web3.eth.defaultAccount)
      try {
        const estemated_Gas = await contract.methods
          .buy(mintNumber)
          .estimateGas({
            from: address,
            value: web3.utils.toWei(total.toString(), "ether"),
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
          });
        console.log(estemated_Gas);
        const result = await contract.methods.buy(mintNumber).send({
          from: address,
          value: web3.utils.toWei(total.toString(), "ether"),
          gas: estemated_Gas,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null,
        });
      } catch (error) {
        show_error_alert(error);
      }

      // await contract.methods.tokenByIndex(i).call();
    }
  }

  return (
    <div className="banner-page-b">
      <div className="banner-page main-wrapper d-flex align-items-center">
        <video autoPlay muted loop id="myVideo" playsInline>
          <source src="/file.mp4" type="video/mp4" />
        </video>
        <div className="container">
          <div className="row">
            <div className="col-12 banner-page-top">
              <img
                className="main-banner-img"
                src="/imgs/main-img.webp"
                alt="#"
              />
              <img
                className="main-banner-img1 visible-xs"
                src="/imgs/main-img1.webp"
                alt="#"
              />
            </div>

            <div className="col-12 text-center banner-img-col">
              <img
                className="banner-img1"
                src="/imgs/banner-img-01.gif"
                alt="banner"
                style={{
                  height: "245px !important",
                  marginTop: "65px",
                  marginLeft: "10px",
                }}
              />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12 banner-page-bottom d-flex">
              <a href="https://twitter.com/TrippyVC">
                <img
                  className="icon-imgn icon-img1 hidden-xs"
                  src="/imgs/icon1.png"
                  alt="#"
                />
              </a>

              <a className="" href="https://twitter.com/TrippyVC">
                <img
                  className="social-icon-img1 visible-xs"
                  src="/imgs/icon1.png"
                  alt="#"
                />
              </a>
              <a href="https://discord.gg/xZ6mhExmsF">
                <img
                  className="social-icon-img2 visible-xs"
                  src="/imgs/icon2.png"
                  alt="#"
                />
              </a>

              <img
                className="main-bottom-img hidden-xs"
                src="/imgs/bootom-banner.webp"
                alt="#"
              />
              <img
                className="main-bottom-img visible-xs"
                src="/imgs/img11.webp"
                alt="#"
              />

              <a href="http://docs.haseeds.com">
                <img
                  className="btn-img1 hidden-xs"
                  src="/imgs/btn2.png"
                  alt="#"
                />
              </a>
              <a href="http://docs.haseeds.com">
                <img
                  className="btn-img1 visible-xs"
                  src="/imgs/btn21.png"
                  alt="#"
                />
              </a>

              <a onClick={mintButtonClickHandler}>
                <img
                  className="logo-img hidden-xs"
                  src="/imgs/logo.webp"
                  alt="#"
                />
              </a>
              <a onClick={mintButtonClickHandler}>
                <img
                  className="logo-img visible-xs"
                  src="/imgs/logo1.webp"
                  alt="#"
                  style={{ marginTop: "10px" }}
                />
              </a>

              <a href="https://trippy.vc">
                <img
                  className="btn-img2 hidden-xs"
                  src="/imgs/btn1.png"
                  alt="#"
                />
              </a>
              <a href="https://trippy.vc">
                <img
                  className="btn-img2 visible-xs"
                  src="/imgs/btn11.png"
                  alt="#"
                />
              </a>

              <a href="https://discord.gg/xZ6mhExmsF">
                <img
                  className="icon-imgn icon-img2 hidden-xs"
                  src="/imgs/icon2.png"
                  alt="#"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
