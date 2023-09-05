// import { ConnectPayments } from "@stripe/react-connect-js";
import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, PaymentElement, useElements, useStripe, ExpressCheckoutElement, AddressElement } from "@stripe/react-stripe-js";
import { FaArrowLeft } from "react-icons/fa";

export default function TipBoxCheckoutForm(props:any) {
    const stripe = useStripe();
    const elements = useElements();

    async function handleSubmit(event: any) {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        // const result = await stripe.confirmPayment({
        //     //`Elements` instance that was used to create the Payment Element
        //     elements,
        //     confirmParams: {
        //         return_url: `${process.env.NEXT_PUBLIC_URL}/${props.user?.username}`,
        //     },
        // });

        // if (result.error) {
        //     // Show error to your customer (for example, payment details incomplete)
        //     console.log(result.error.message);
        // } else {
        //     // Your customer will be redirected to your `return_url`. For some payment
        //     // methods like iDEAL, your customer will be redirected to an intermediate
        //     // site first to authorize the payment, then redirected to the `return_url`.
        //     props.setStep(3);
        // }

        const result = await stripe.confirmCardPayment(props.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement) as any,
                billing_details: {
                    email: props.email,
                },
            }
        })

        if (result.error) {
            // Show error to your customer (for example, insufficient funds)
            console.log(result.error.message);
        } else {
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            // There's a risk of the customer closing the window before callback
            // execution. Set up a webhook or plugin to listen for the
            // payment_intent.succeeded event that handles any business critical
            // post-payment actions. this is when we should add the tip to the db
            props.setStep(1);
            console.log("success")

            props.setShowConfetti(true)
            props.openModal('success')
        }
        }
    }

    const cardStyle = {
        iconStyle: "solid",
        style: {
            base: {
                iconColor: "#ff7ac6",
                color: "#fff",
                fontSmoothing: "antialiased",
                fontSize: "18px",
                "::placeholder": {
                color: "#9ca3a4",
                },
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
            },
        }
    }

    return (
        <>
            <form className="flex flex-col w-full h-full" onSubmit={(e) => {
                handleSubmit(e)
            }}>
                <div className="flex flex-col w-full mt-5">
                    <input type="email" className="input input-bordered input-lg" placeholder="Email" onChange={(e) => {
                        props.setEmail(e.target.value)
                    }} />
                </div>
                
                <div className="mt-5 rounded-lg bg-base-200 p-2 py-3 border-zinc-500 border">
                    {/* <PaymentElement /> */}
                    {/* <ConnectPayments /> */}

                    <div className="flex flex-col w-full">
                        {/* <label className="text-md font-bold text-zinc-400 ml-1 mb-1">Card Number</label>
                        <CardNumberElement options={cardStyle} className="text-white bg-base-100 p-6 text-lg rounded-lg" />

                        <div className="justify-between flex flex-row items-center mt-3 w-full gap-2">

                            <div className="flex flex-col w-1/2">
                                <label className="text-md font-bold text-zinc-400 ml-1 mb-1">Expiration Date</label>
                                <CardExpiryElement options={cardStyle} className="text-white bg-base-100 p-6 text-lg rounded-lg" />
                            </div>

                            <div className="flex flex-col w-1/2">
                                <label className="text-md font-bold text-zinc-400 ml-1 mb-1">CVC</label>
                                <CardCvcElement options={cardStyle} className="text-white bg-base-100 p-6 text-lg rounded-lg" />
                            </div>

                        </div> */}
                        <label className="text-md font-semibold text-zinc-400 ml-1 mb-1">Card Details</label>
                        <CardElement options={cardStyle as any} className="text-white bg-base-100 p-6 text-lg rounded-lg border border-zinc-700" />
                    </div>


                    <div className="flex flex-row items-center mt-5 w-full gap-2">
                        <p className="text-md font-bold text-zinc-400 bg-base-100 w-full rounded-md p-4 border border-zinc-700 text-center">Powered by Stripe</p>
                    </div>
                </div>

                
                <div className="flex flex-row text-left justify-start mt-5 gap-2 btn btn-ghost w-fit" onClick={() => {
                    props.setStep(1)
                }}>
                    <FaArrowLeft className="text-zinc-400" /> 
                    <p className="font-semibold text-zinc-400">Go Back</p>
                </div>

                <p className="text-sm font-semibold text-zinc-400 mt-5">By clicking Pay, you agree to the <a href="/terms" target="_blank" className="link-primary link-hover text-zinc-400">Terms</a> and <a href="/privacy" target="_blank" className="link-primary link-hover text-zinc-400">Privacy Policy</a></p>

                <button className="btn btn-primary mt-2 btn-lg" disabled={
                    props.email == "" || props.email == null || props.email == undefined
                }>Pay {props.user?.username} ${props.amount}</button>

            </form>
        </>
    )
} 