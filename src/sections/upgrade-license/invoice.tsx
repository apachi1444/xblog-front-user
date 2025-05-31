import './style.css';

import React from 'react'; // You can use the same CSS as before

const Invoice = () => (
    <div className="invoice-container">
      <header>
        <div className="company-info">
          <h2>Your Company Inc.</h2>
          <p>
            1234 Company St,<br />
            Company Town, ST 12345
          </p>
        </div>
      </header>

      <div className="invoice-title">
        <h1>INVOICE</h1>
      </div>

      <section className="bill-info">
        <div>
          <h4>Bill To</h4>
          <p>
            Customer Name<br />
            1234 Customer St,<br />
            Customer Town, ST 12345
          </p>
        </div>
        <div className="invoice-details">
          <p><strong>Invoice #</strong> 0000007</p>
          <p><strong>Invoice date</strong> 10-02-2023</p>
          <p><strong>Due date</strong> 10-16-2023</p>
        </div>
      </section>

      <table>
        <thead>
          <tr>
            <th>QTY</th>
            <th>Description</th>
            <th>Unit Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1.00</td>
            <td>Replacement of spark plugs</td>
            <td>$40.00</td>
            <td>$40.00</td>
          </tr>
          <tr>
            <td>2.00</td>
            <td>Brake pad replacement (front)</td>
            <td>$40.00</td>
            <td>$80.00</td>
          </tr>
          <tr>
            <td>4.00</td>
            <td>Wheel alignment</td>
            <td>$17.50</td>
            <td>$70.00</td>
          </tr>
          <tr>
            <td>1.00</td>
            <td>Oil change and filter replacement</td>
            <td>$40.00</td>
            <td>$40.00</td>
          </tr>
        </tbody>
      </table>

      <div className="totals">
        <p><strong>Subtotal</strong> $230.00</p>
        <p><strong>Sales Tax (5%)</strong> $11.50</p>
        <p className="total"><strong>Total (USD)</strong> $241.50</p>
      </div>

      <footer>
        <h4>Terms and Conditions</h4>
        <p>Payment is due in 14 days</p>
        <p>Please make checks payable to: Your Company Inc.</p>
      </footer>
    </div>
  );

export default Invoice;
