import React, { Component } from "react";
import { postJSON, postForm } from "../api";

import {
  ArrowLeft,
  Upload,
  Shield,
  CheckCircle,
  Loader2,
} from "lucide-react";
import MatrixRain from "./MatrixRain";

class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      registrationData: null,
      transactionId: "",
      screenshot: null,
      previewUrl: null,
      isSubmitting: false,
      errors: {},

      // TXN check
      txnUnique: null,
      txnMsg: "",
      checkingTxn: false,
    };

    this.fileInputRef = React.createRef();
    this.txnDebounceTimer = null;
  }

componentDidMount() {
  const data = localStorage.getItem("registrationData");

  if (!data) {
    // ❌ Block direct /payment access
    window.location.replace("/register");
    return;
  }

  this.setState({ registrationData: JSON.parse(data) });
}


  // ================= FILE =================
  handleFileChange = (e) => {
    const file = e.target.files[0];
    const errors = { ...this.state.errors };

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      errors.screenshot = "Only image files allowed";
      this.setState({ errors });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      errors.screenshot = "File must be under 5MB";
      this.setState({ errors });
      return;
    }

    this.setState({
      screenshot: file,
      previewUrl: URL.createObjectURL(file),
      errors: { ...errors, screenshot: "" },
    });
  };

  // ================= TXN UNIQUE CHECK =================
checkTxnUnique = async (txn) => {
  if (!txn || txn.length < 6) return;

  this.setState({ checkingTxn: true });

  try {
    const data = await postJSON("/check-unique", {
      transactionId: txn,
    });

    this.setState({
      txnUnique: data.unique,
      txnMsg: data.message,
      checkingTxn: false,
    });
  } catch {
    this.setState({
      txnUnique: false,
      txnMsg: "Server error while checking transaction",
      checkingTxn: false,
    });
  }
};

  // ================= DEBOUNCED WRAPPER =================
  checkTxnUniqueDebounced = (value) => {
    clearTimeout(this.txnDebounceTimer);

    this.txnDebounceTimer = setTimeout(() => {
      this.checkTxnUnique(value);
    }, 500);
  };

  // ================= VALIDATION =================
  validateForm = () => {
    const errors = {};
    const { transactionId, screenshot } = this.state;

    if (!transactionId.trim()) {
      errors.transactionId = "Transaction ID is required";
    } else if (transactionId.length < 6) {
      errors.transactionId = "Invalid Transaction ID";
    }

    if (!screenshot) {
      errors.screenshot = "Payment screenshot required";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  // ================= SUBMIT =================
handleSubmit = async (e) => {
  e.preventDefault();

  if (this.state.txnUnique === false) {
    alert("Transaction ID already used");
    return;
  }

  if (!this.validateForm()) {
    alert("Fix validation errors");
    return;
  }

  this.setState({ isSubmitting: true });

  const { registrationData, transactionId, screenshot } = this.state;
  const formData = new FormData();

  formData.append("teamName", registrationData.teamName);

  formData.append("m1name", registrationData.member1.name);
  formData.append("m1College", registrationData.member1.college);
  formData.append("m1email", registrationData.member1.email);
  formData.append("m1phone", registrationData.member1.phone);

  formData.append("m2name", registrationData.member2.name || "");
  formData.append("m2College", registrationData.member2.college || "");
  formData.append("m2email", registrationData.member2.email || "");
  formData.append("m2phone", registrationData.member2.phone || "");

  formData.append("transactionId", transactionId);
  formData.append("screenshot", screenshot);

  try {
    // ✅ SINGLE backend call
    const result = await postForm("/submit-payment", formData);

    if (!result.success) {
      alert(result.error || "Submission failed");
      this.setState({ isSubmitting: false });
      return;
    }

    // ✅ SUCCESS FLOW
    localStorage.removeItem("registrationData");
    localStorage.setItem("paymentDone", "true");
    window.location.href = "/success";

  } catch (err) {
    alert(err.message || "Server not reachable");
    this.setState({ isSubmitting: false });
  }
};


  // ================= UI =================
  render() {
    const {
      registrationData,
      transactionId,
      previewUrl,
      isSubmitting,
      errors,
      txnUnique,
      txnMsg,
      checkingTxn,
    } = this.state;

    if (!registrationData) return null;

    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <MatrixRain />
        <div className="scan-lines pointer-events-none" />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg">
            <button
              onClick={() => (window.location.href = "/register")}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Registration
            </button>

            <div className="glass-card rounded-lg p-8 neon-border pulse-glow">
              <div className="text-center mb-6">
                <Shield className="w-6 h-6 mx-auto text-primary animate-pulse" />
                <h1 className="text-2xl font-bold text-primary tracking-wider">
                  PAYMENT VERIFICATION
                </h1>
              </div>

              <form onSubmit={this.handleSubmit} className="space-y-6">
                {/* TRANSACTION ID */}
                <div>
                  <input
                    type="text"
                    placeholder="Transaction ID"
                    value={transactionId}
                    onChange={(e) => {
                      const value = e.target.value;
                      this.setState({
                        transactionId: value,
                        errors: { ...errors, transactionId: "" },
                        txnUnique: null,
                      });
                      this.checkTxnUniqueDebounced(value);
                    }}
                  className={`w-full bg-black text-white border ${
  errors.transactionId || txnUnique === false
    ? "border-red-500"
    : "border-cyan-400/60"
} rounded px-4 py-3 font-mono
focus:outline-none focus:border-cyan-400
focus:shadow-[0_0_15px_rgba(0,255,255,0.6)]
transition`}

                  />

                  {checkingTxn && (
                    <p className="text-yellow-400 text-xs mt-1">
                      Checking transaction ID…
                    </p>
                  )}
                  {txnUnique === false && (
                    <p className="text-red-500 text-xs mt-1">❌ {txnMsg}</p>
                  )}
                  {txnUnique === true && (
                    <p className="text-green-400 text-xs mt-1">✅ {txnMsg}</p>
                  )}
                </div>

                {/* SCREENSHOT */}
                <div
                  className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center cursor-pointer"
                  onClick={() => this.fileInputRef.current.click()}
                >
                  <input
                    ref={this.fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={this.handleFileChange}
                  />

                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Screenshot"
                        className="max-h-40 mx-auto rounded"
                      />
                      <CheckCircle className="mx-auto mt-2 text-primary" />
                    </>
                  ) : (
                    <>
                      <Upload className="mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload payment screenshot
                      </p>
                    </>
                  )}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isSubmitting || txnUnique === false}
                  className="w-full cyber-btn py-4 flex justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      Submit Payment
                      <Shield />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Payment;
