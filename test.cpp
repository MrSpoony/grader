#include <bits/stdc++.h>

using namespace std;

#define FOR(i, j, k, in) for (long long int i=j ; i<k ; i+=in)
#define RFOR(i, j, k, in) for (long long int i=j ; i>=k ; i-=in)
#define REP(i, j) FOR(i, 0, j, 1)
#define RREP(i, j) RFOR(i, j, 0, 1)
#define FOREACH(i, j) for (auto i : j) 
#define MP make_pair
#define PB push_back
#define F first
#define S second
#define INF 2147483647
#define INFINITE 9223372036854775807
#define PI 3.1415926535897932384626433832795
#define MOD 1000000007
#define dl "\n"

typedef long long int lint;
typedef pair<lint, lint> PII;
typedef priority_queue<lint> PQI;
typedef priority_queue<lint, vector<lint>, greater<lint>> RPQI;
typedef priority_queue<PII> PQII;
typedef queue<lint> QI;
typedef vector<bool> VB;
typedef vector<string> VS;
typedef vector<lint> VI;
typedef vector<PII> VII;
typedef vector<VI> VVI;
typedef vector<VII> VVII;



int main() {
    ios_base::sync_with_stdio(false); // Desync c++ and c input/output
    cin.tie(0); // Disable automatic input flush respectively making output then when it's couted
    
    lint n = 999;
    VI nums(n);
    REP (i, n) {
        lint x = rand()%(int)10e9;
        cout << x << " ";
        nums[i] = x;
    }

    cout << dl << dl << dl << dl;

    VI dp(n);
    dp[0] = 1;
    for (lint i = 1; i < n; i++) {
        lint curr = 1;
        for (lint j = i; j >= 0; j--) {
            if (nums[j] >= nums[i]) continue;
            curr = max(curr, dp[j]+1);
        }
        dp[i] = curr;
    }
    lint ans = 1;
    REP (i, n) {
        ans = max(ans, dp[i]);
    }
    cout << ans << dl;
    return 0;
}
