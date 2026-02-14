### Run Migration

``` npx prisma migrate dev --name init ```

```npx prisma generate```

```
npx prisma migrate reset
```

```
rm -rf node_modules .prisma
npm install
npx prisma generate
npx prisma migrate reset
```


```
npm cache clean --force
npm install --ignore-scripts
```

### Push Scheme to Database

``` npx prisma db push ```

## Prepare Your VPS
### Ensure your Ubuntu VPS is updated:

```
sudo apt update
sudo apt upgrade -y

```

## Install Node.js and npm
   ### Install Node.js (you can use the NodeSource repository to install the latest stable version):

```
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
apt-get install nodejs -y

```

### Verify the installation:
```
node -v
npm -v
```

## Install PostgreSQL
  ### Install PostgreSQL on the VPS:

```
sudo apt install postgresql postgresql-contrib -y
```

```
http://localhost:4000/v1/customer/monthly-point/1

http://localhost:3000/auth/signup?sponsorid=1&&side=left 
http://localhost:4000/cron/customer/point-distribute-daily
http://localhost:4000/cron/customer/point-distribute-monthly
http://localhost:4000/cron/customer/point-distribute-generation

https://omninestglobal.com/auth/signup?sponsorid=1&&side=left   = Sponsor Signup
https://omninestglobal.com/api/cron/customer/point-distribute-daily = Daily point/Match distribute
https://omninestglobal.com/api/cron/customer/point-distribute-monthly = Monthly point distribute
https://omninestglobal.com/api/cron/customer/point-distribute-generation = Generation point distribute
```

```
http://localhost:4000/v1/customer/sponsor-downline/1
```


### API END POINT

[Self Purchase for MLM](http://localhost:4000/v1/mlm/user-self-purchase)
[Check Sponsor and Placement is exist in the tree] (http://localhost:4000/v1/tree/exist/sponsor-placement/:sponsoruid/:placementuid)


## TOTAL EARNING
Affilaite commistion (Sponsor)
DailyMatch
MonthlyMatch
Generation


### QUERY FOR DELETE WHERE MATCH

```
const deletedUsers = await prisma.user.deleteMany({
  where: {
    id: {
      in: [1, 2, 3],  // Delete users where id is 1, 2, or 3
    },
  },
});
```

### QUERY FOR DELETE WHERE MATCH NOT
const deletedUsers = await prisma.user.deleteMany({
  where: {
    NOT: {
      id: {
        in: [1, 2, 3],  // Delete users where id is not 1, 2, or 3
      },
    },
  },
});



### ECOMMERCE API ENDPOINT
1. Cateogry By Id
2. Category By slug

v1/category/1
v1/category/products/category-slug
v1/admin/product/add-product-category
v1/category/products/category-slug (Category with product with category-slug)
[Product Reviews by Product ID](http://localhost:4000/v1/product/reviews/1)



### DB GUID

postgresql://postgres:Dhaka@1230@localhost:5432/expertcom
```


1️⃣ Prerequisites (do this once)
🔹 Update server
sudo apt update && sudo apt upgrade -y

🔹 Install Node.js (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v


sudo chown -R $USER:$USER /var/www/designplanetbd



pm2 start index.js --name backend-designplanet
pm2 save
pm2 status


sudo nano /etc/nginx/sites-available/backend.designplanetbd.com

server {
    server_name backend.designplanetbd.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

sudo nginx -t