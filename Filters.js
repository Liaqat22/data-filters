import React, { useEffect, useState } from 'react';
import { Typography, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Slider, TextField } from '@mui/material';
import axios from 'axios';

function Filters() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [categories, setCategories] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`https://vercel-api-deployment.vercel.app/api/v1/product/get-product`);
      if (data.success) {
        setProducts(data.products);
        const uniqueCategories = [...new Set(data.products.map(p => p.category?.name))].filter(Boolean);
        setCategories(uniqueCategories);
        console.log(uniqueCategories, "uni");
      }
    } catch (error) {
      console.log('error in product getting');
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories(prev =>
      checked ? [...prev, value] : prev.filter(cat => cat !== value)
    );
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <>
      <div className='container-fluid'>
        <div className='row d-flex justify-content-center'>
          <div className = "col-md-9 m-3">
          <form>
            <div>
              <TextField
                className='input'
                type='text'
                name='text'
                placeholder='Search Products....'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </div>
          </form>
          </div>
          <div className='col-md-3'>
            <Typography variant="h3">Filters</Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend">Category</FormLabel>
              <FormGroup>
                {categories.map((cat) => (
                  <FormControlLabel
                    key={cat}
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(cat)}
                        onChange={handleCategoryChange}
                        value={cat}
                      />
                    }
                    label={cat}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <Typography variant="h6">Price Range</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              step={5}
            />
          </div>
          
          <div className='col-md-9'>
            <Typography variant="h3">Products</Typography>
            <div className='row'>
              {
                products.filter((p) => {
                  const matchesSearch = searchTerm.toLowerCase() === '' ? true : (p.name || p.description).toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesCategory = selectedCategories.length === 0 ? true : selectedCategories.includes(p?.category?.name);
                  // console.log(matchesCategory,"cat")
                  const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
                  return matchesSearch && matchesCategory && matchesPrice;
                }).map((p) => (
                  <div className='col-md-3 mt-2' key={p._id}>  
                    <div className='card p-3'>
                      <Typography variant='h6'>{p?.name}</Typography>
                      <Typography variant="body2">{p?.description.substring(0, 30)}</Typography>
                      <Typography variant='body1'>{p?.price} pkr</Typography>
                      <Typography variant='body1'><b>{p?.category?.name}</b> </Typography>
                      <Typography variant='body2'>{ new Date(p?.createdAt).toISOString().slice(0, 10)} </Typography>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Filters;
