// Using built-in fetch (Node.js 18+)

const BASE_URL = 'http://localhost:3015';

async function testEntrepriseAccess() {
  try {
    console.log('Testing entreprise data access for cashier user...\n');

    // First, login as cashier
    console.log('1. Logging in as cashier...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'caissier@agrisolutions.ml',
        motDePasse: 'caissier123'
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.error('Login failed:', error);
      return;
    }

    const loginData = await loginResponse.json();
    const { accessToken, refreshToken } = loginData;

    console.log('✅ Login successful');
    console.log('User:', loginData.utilisateur.email, 'Role:', loginData.utilisateur.role);

    // Test accessing entreprises list
    console.log('\n2. Testing entreprise list access...');
    const entreprisesResponse = await fetch(`${BASE_URL}/api/entreprises`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!entreprisesResponse.ok) {
      const error = await entreprisesResponse.text();
      console.error('❌ Failed to access entreprises:', error);
      return;
    }

    const entreprisesData = await entreprisesResponse.json();
    console.log('✅ Entreprises access successful');
    console.log('Number of entreprises returned:', entreprisesData.entreprises?.length || 0);

    if (entreprisesData.entreprises && entreprisesData.entreprises.length > 0) {
      console.log('Entreprises:');
      entreprisesData.entreprises.forEach((entreprise, index) => {
        console.log(`  ${index + 1}. ${entreprise.nom} (ID: ${entreprise.id})`);
      });
    }

    // Test accessing specific entreprise
    if (entreprisesData.entreprises && entreprisesData.entreprises.length > 0) {
      const entrepriseId = entreprisesData.entreprises[0].id;
      console.log(`\n3. Testing access to entreprise ID ${entrepriseId}...`);

      const entrepriseDetailResponse = await fetch(`${BASE_URL}/api/entreprises/${entrepriseId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (!entrepriseDetailResponse.ok) {
        const error = await entrepriseDetailResponse.text();
        console.error('❌ Failed to access entreprise details:', error);
        return;
      }

      const entrepriseDetailData = await entrepriseDetailResponse.json();
      console.log('✅ Entreprise details access successful');
      console.log('Entreprise:', entrepriseDetailData.entreprise.nom);
    }

    console.log('\n🎉 All tests passed! The cashier can now access entreprise data.');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testEntrepriseAccess();