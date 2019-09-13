
cmake . -DBUILD_TESTS:BOOL=true -DBUILD_MAIN:BOOL=true
make 
./minacoin-core-test
./minacoin-core
