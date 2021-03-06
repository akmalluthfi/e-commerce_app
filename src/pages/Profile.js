import { useContext, useRef, useState } from 'react';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { CustomerContext } from '../App';
import { updateProfile } from '../controllers/ProfileController';
import ImageUploading from 'react-images-uploading';
import axios from 'axios';
import { getAccTk, getApiKey, getBaseUrl } from '../models/storage';

export default function Profile() {
  const { data: customer, setData: setCustomer } = useContext(CustomerContext);
  // ref
  const firstName = useRef(null);
  const surName = useRef(null);
  const email = useRef(null);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const first_name = firstName.current.value;
    const surname = surName.current.value;
    const emailVal = email.current.value;

    let count = 0;
    if (customer.first_name === first_name) count++;
    if (customer.surname === surname) count++;
    if (customer.email === emailVal) count++;

    // ! validasi

    if (count === 3) {
      // swal data berhasil diubah
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated successfully',
      }).then(() => {
        setLoading(false);
      });
    } else {
      const { success, message } = await updateProfile(
        first_name,
        surname,
        emailVal
      );

      if (!success) {
        firstName.current.value = customer.first_name;
        surName.current.value = customer.surname;
        email.current.value = customer.email;
        Swal.fire({
          icon: 'warning',
          title: message,
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: message,
        });
      }

      setLoading(false);
    }
  };

  const onChange = async (imageList) => {
    const data = new FormData();
    data.append('picture', imageList[0].file);
    try {
      const url = `${getBaseUrl()}/customers/profile/picture`;
      const config = {
        headers: {
          'x-api-key': getApiKey(),
          'access-token': getAccTk() ?? '',
        },
      };

      const response = await axios.post(url, data, config);

      if (!response.data.success) return new Error('Gambar gagal diupload');

      setCustomer((prev) => {
        return { ...prev, picture_url: imageList[0].data_url };
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className='my-3'>
      <ImageUploading onChange={onChange} dataURLKey='data_url'>
        {({ onImageUpload, dragProps }) => (
          <Form.Group controlId='picture' className='mb-3 text-center'>
            <Form.Label onClick={onImageUpload} {...dragProps}>
              <img
                src={customer.picture_url}
                alt={`${customer.first_name} ${customer.surname} profile`}
                className='object-fit-cover object-position-center rounded-circle mb-3'
                style={{ width: 150, height: 150, cursor: 'pointer' }}
              />
              <h6 style={{ cursor: 'pointer' }}>Change</h6>
            </Form.Label>
          </Form.Group>
        )}
      </ImageUploading>
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='first_name'>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='First Name'
            name='first_name'
            defaultValue={customer.first_name}
            ref={firstName}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='last_name'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Last Name'
            name='last_name'
            defaultValue={customer.surname}
            ref={surName}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Email Address'
            name='email'
            defaultValue={customer.email}
            ref={email}
          />
        </Form.Group>
        <Form.Group className='mb-3 text-end'>
          <Button type='submit' className='btn-gunmetal'>
            {isLoading ? (
              <Spinner animation='border' size='sm' className='mx-3' />
            ) : (
              'Submit'
            )}
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
}
